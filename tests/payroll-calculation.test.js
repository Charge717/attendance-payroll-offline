const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const APP_PATH = path.join(PROJECT_ROOT, 'src', 'index.html');
const STORAGE_KEY = 'attendance_mgmt_v2';

function createElementStub(id = '') {
  return {
    id,
    value: '',
    innerHTML: '',
    textContent: '',
    checked: false,
    disabled: false,
    dataset: {},
    style: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; }
    },
    addEventListener() {},
    removeEventListener() {},
    appendChild() {},
    click() {},
    reset() {},
    setAttribute() {},
    getAttribute() { return null; }
  };
}

function extractAppScript() {
  const html = fs.readFileSync(APP_PATH, 'utf8');
  const marker = '//  CONSTANTS';
  const markerIndex = html.indexOf(marker);
  assert.notEqual(markerIndex, -1, 'app script marker should exist');
  const scriptOpen = html.lastIndexOf('<script>', markerIndex);
  assert.notEqual(scriptOpen, -1, 'app script tag should exist');
  const scriptStart = html.indexOf('>', scriptOpen) + 1;
  const scriptEnd = html.indexOf('</script>', scriptStart);
  return html.slice(scriptStart, scriptEnd);
}

function loadApp() {
  const elements = new Map();
  const storage = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, createElementStub(id));
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    createElement(tagName) {
      const el = createElementStub(tagName);
      el.tagName = String(tagName).toUpperCase();
      return el;
    }
  };

  const context = {
    console,
    document,
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      },
      clear() {
        storage.clear();
      }
    },
    alert(message) {
      throw new Error(`Unexpected alert: ${message}`);
    },
    confirm() {
      return true;
    },
    bootstrap: {
      Modal: Object.assign(
        function Modal() {
          return { show() {}, hide() {} };
        },
        {
          getInstance() {
            return { show() {}, hide() {} };
          }
        }
      )
    },
    Blob: class Blob {},
    FileReader: class FileReader {},
    URL: {
      createObjectURL() {
        return 'blob:test';
      },
      revokeObjectURL() {}
    }
  };
  context.window = { print() {} };

  vm.createContext(context);
  vm.runInContext(extractAppScript(), context, { filename: APP_PATH });

  return context;
}

function seedData(app, data) {
  app.localStorage.setItem(STORAGE_KEY, JSON.stringify({
    employees: [],
    attendance: [],
    leaveRecs: [],
    holidayOverrides: [],
    insuranceRates: [],
    monthlyPayrollAdjustments: [],
    ...data
  }));
}

test('paid half-day bereavement leave covers the morning absence and prevents tardiness deduction', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-chen',
    name: '陳莉蓉',
    type: 'monthly',
    salary: 30000,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };
  const attendance = {
    id: 'att-afternoon',
    empId: emp.id,
    date: '2026-04-22',
    checkIn: '13:00',
    checkOut: '17:00',
    dayType: 'normal',
    holidayMode: '',
    note: ''
  };
  seedData(app, {
    employees: [emp],
    attendance: [attendance],
    leaveRecs: [{
      id: 'leave-bereavement-am',
      empId: emp.id,
      date: attendance.date,
      type: 'bereavement',
      days: 0.5,
      hours: 0,
      bereavementTier: '8',
      bereavementCaseKey: '2026-父喪',
      note: '上午喪假'
    }]
  });

  const calc = app.calcRecord(attendance, emp);
  assert.equal(calc.tardinessMin, 0);
  assert.equal(calc.tardinessDeduct, 0);
  assert.equal(calc.normalHours, 8);

  const payroll = app.calcMonthlyPayroll(emp, 2026, 4);
  assert.equal(payroll.totalTardMin, 0);
  assert.equal(payroll.totalTardDeduct, 0);
  assert.equal(payroll.totalLeaveDeduct, 0);
  assert.equal(payroll.totalNormalHours, 8);
});

test('personal leave minutes cover absent time while regular worked minutes remain payable', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-hourly',
    name: '時薪員工',
    type: 'hourly',
    salary: 125,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };
  const attendance = {
    id: 'att-afternoon',
    empId: emp.id,
    date: '2026-04-22',
    checkIn: '13:00',
    checkOut: '17:00',
    dayType: 'normal',
    holidayMode: '',
    note: ''
  };
  seedData(app, {
    employees: [emp],
    attendance: [attendance],
    leaveRecs: [{
      id: 'leave-personal-am',
      empId: emp.id,
      date: attendance.date,
      type: 'personal',
      days: 0,
      hours: 4,
      note: '上午事假'
    }]
  });

  const payroll = app.calcMonthlyPayroll(emp, 2026, 4);
  assert.equal(payroll.totalTardMin, 0);
  assert.equal(payroll.totalLeaveMinutes, 240);
  assert.equal(payroll.totalLeaveDeduct, 0);
  assert.equal(payroll.totalNormalHours, 4);
  assert.equal(payroll.hourlyPay, 500);
  assert.equal(payroll.gross, 500);
});

test('checkout inside lunch counts only actual lunch overlap for early leave and normal hours', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-monthly',
    name: '月薪員工',
    type: 'monthly',
    salary: 30000,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };
  const attendance = {
    id: 'att-lunch-checkout',
    empId: emp.id,
    date: '2026-04-27',
    checkIn: '07:51',
    checkOut: '12:02',
    dayType: 'normal',
    holidayMode: '',
    note: ''
  };

  const calc = app.calcRecord(attendance, emp);
  assert.equal(calc.tardinessMin, 0);
  assert.equal(calc.earlyLeaveMin, 240);
  assert.equal(calc.normalHours, 4);
  assert.equal(calc.earlyLeaveDeduct, 500);
});

test('full weekday and lunch boundary checkouts keep lunch unpaid without shrinking work minutes', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-monthly',
    name: '月薪員工',
    type: 'monthly',
    salary: 30000,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };

  const fullDay = app.calcRecord({
    empId: emp.id,
    date: '2026-04-27',
    checkIn: '08:00',
    checkOut: '17:00',
    dayType: 'normal',
    holidayMode: '',
    note: ''
  }, emp);
  assert.equal(fullDay.normalHours, 8);
  assert.equal(fullDay.earlyLeaveMin, 0);

  const duringLunch = app.calcRecord({
    empId: emp.id,
    date: '2026-04-27',
    checkIn: '08:00',
    checkOut: '12:59',
    dayType: 'normal',
    holidayMode: '',
    note: ''
  }, emp);
  assert.equal(duringLunch.normalHours, 4);
  assert.equal(duringLunch.earlyLeaveMin, 240);

  const beforeLunch = app.calcRecord({
    empId: emp.id,
    date: '2026-04-27',
    checkIn: '08:00',
    checkOut: '11:59',
    dayType: 'normal',
    holidayMode: '',
    note: ''
  }, emp);
  assert.equal(beforeLunch.normalHours, 3.98);
  assert.equal(beforeLunch.earlyLeaveMin, 241);
});

test('monthly payroll totals sum all employee net pay for the settlement header', () => {
  const app = loadApp();
  const totals = app.getPayrollSummaryTotals([
    { summary: { grossBeforeDeduction: 30000, deductions: 1200, netPay: 28800 } },
    { summary: { grossBeforeDeduction: 18500, deductions: 500, netPay: 18000 } }
  ]);

  assert.equal(totals.employeeCount, 2);
  assert.equal(totals.grossBeforeDeduction, 48500);
  assert.equal(totals.deductions, 1700);
  assert.equal(totals.netPay, 46800);
});

test('core UI exposes Traditional Chinese and English locale labels', () => {
  const app = loadApp();

  assert.deepEqual(Array.from(app.getSupportedLocales()), ['zh-TW', 'en']);
  assert.equal(app.translateText('app.title', 'zh-TW'), '出勤薪資管理系統');
  assert.equal(app.translateText('app.title', 'en'), 'Attendance Payroll Offline');
  assert.equal(app.translateText('tabs.payroll', 'en'), 'Payroll');
  assert.equal(
    app.translateText('app.scopeNotice', 'en'),
    'Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.'
  );
});

test('English locale translates common static UI labels and payroll units', () => {
  const app = loadApp();

  assert.equal(app.translateLiteralText('員工資料一覽', 'en'), 'Employee Directory');
  assert.equal(app.translateLiteralText('新增員工', 'en'), 'Add Employee');
  assert.equal(app.translateLiteralText('薪資類型', 'en'), 'Pay Type');
  assert.equal(app.translateLiteralText('勞健保參考表', 'en'), 'Labor and Health Insurance Reference Table');
  assert.equal(app.translateLiteralText('預覽計算結果', 'en'), 'Calculation Preview');
  assert.equal(app.translateLiteralText('請填寫上下班時間後自動顯示', 'en'), 'Enter check-in and check-out times to preview automatically');
  assert.equal(app.translateLiteralText('300 元', 'en'), 'NT$300');
  assert.equal(app.translateLiteralText('240 分鐘', 'en'), '240 min');
  assert.equal(app.translateLiteralText('4 小時', 'en'), '4 h');
  assert.equal(app.translateDialogText('請填寫員工姓名', 'en'), 'Please enter the employee name');
  assert.equal(
    app.translateDialogText('將載入 2026 官方參考表 10 筆，保留現有自訂列 2 筆。是否繼續？', 'en'),
    'Load the 2026 official reference table with 10 rows and keep 2 custom rows. Continue?'
  );
});

test('English locale localizes payroll, report, payslip, and workbook outputs', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-alex',
    name: 'Alex Lin',
    type: 'monthly',
    salary: 30000,
    bonus: 1000,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    start: '2026-01-01',
    active: true,
    note: ''
  };

  seedData(app, {
    employees: [emp],
    attendance: [{
      id: 'att-full-day',
      empId: emp.id,
      date: '2026-04-01',
      checkIn: '08:00',
      checkOut: '17:00',
      dayType: 'normal',
      holidayMode: '',
      note: ''
    }]
  });

  app.setAppLocale('en');
  app.document.getElementById('reportMonth').value = '2026-04';
  app.document.getElementById('reportEmpFilter').value = '';
  app.renderReports();

  const reportHtml = app.document.getElementById('reportResult').innerHTML;
  assert.doesNotMatch(reportHtml, /[\u4e00-\u9fff]/);
  assert.match(reportHtml, /Employee Monthly Payroll Details/);
  assert.match(reportHtml, /Company Monthly Summary/);

  app.document.getElementById('payMonth').value = '2026-04';
  app.calculatePayroll();
  const payrollHtml = app.document.getElementById('payrollResult').innerHTML;
  assert.doesNotMatch(payrollHtml, /[\u4e00-\u9fff]/);
  assert.match(payrollHtml, /Payroll Settlement Report/);
  assert.match(payrollHtml, /All-Employee Net Payroll Total/);

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  const payslipHtml = app.localizeHtmlOutput(app.buildPayslipPrintHtml(snapshot), 'en');
  assert.doesNotMatch(payslipHtml, /[\u4e00-\u9fff]/);
  assert.match(payslipHtml, /Official Payslip/);
  assert.match(payslipHtml, /Employee Signature/);

  const workbook = app.localizeReportWorkbookData(app.buildReportWorkbookData(2026, 4, ''), 'en');
  assert.deepEqual(Array.from(workbook.sheetNames), ['Payroll Summary', 'Payslips', 'Attendance Details', 'Anomaly List']);
  assert.equal(Object.keys(workbook.sheets['Payroll Summary'][0]).includes('Employee'), true);
  assert.equal(Object.keys(workbook.sheets['Payroll Summary'][0]).some(key => /[\u4e00-\u9fff]/.test(key)), false);
});
