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

test('monthly employee leaving mid-month uses leave date for proportional base salary', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-leave-mid-month',
    name: '月底前離職員工',
    type: 'monthly',
    salary: 30000,
    start: '2026-01-01',
    leaveDate: '2026-04-07',
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };

  seedData(app, { employees: [emp] });

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.baseAmount, 7000);
  assert.equal(snapshot.summary.isPartialBase, true);
  assert.equal(snapshot.summary.partialWorkDays, 7);
  assert.equal(snapshot.summary.partialLabel, '月中離職');
  assert.equal(snapshot.summary.netPay, 7000);
});

test('monthly partial-month salary prorates base salary and fixed bonus together', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-partial-bonus',
    name: '未足月固定加給員工',
    type: 'monthly',
    salary: 45000,
    start: '2026-01-01',
    leaveDate: '2026-04-23',
    bonus: 2000,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };

  seedData(app, { employees: [emp] });

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.baseAmount, 36033);
  assert.equal(snapshot.summary.bonus, 0);
  assert.equal(snapshot.summary.isPartialBase, true);
  assert.equal(snapshot.summary.partialWorkDays, 23);
  assert.equal(snapshot.summary.netPay, 36033);
});

test('monthly partial-month tardiness deduction uses the full monthly salary basis including fixed bonus', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-partial-tardy',
    name: '未足月遲到員工',
    type: 'monthly',
    salary: 45000,
    start: '2026-01-01',
    leaveDate: '2026-04-23',
    bonus: 2000,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };
  const attendance = {
    id: 'att-partial-tardy',
    empId: emp.id,
    date: '2026-04-22',
    checkIn: '09:00',
    checkOut: '17:00',
    dayType: 'normal',
    holidayMode: '',
    note: ''
  };

  seedData(app, { employees: [emp], attendance: [attendance] });

  const calc = app.calcRecord(attendance, emp);
  assert.equal(calc.tardinessMin, 60);
  assert.equal(calc.tardinessDeduct, 195.83);

  const payroll = app.calcMonthlyPayroll(emp, 2026, 4);
  assert.equal(payroll.totalTardDeduct, 196);
});

test('monthly partial-month overtime and holiday pay use the full monthly salary basis including fixed bonus', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-partial-ot',
    name: '未足月加班員工',
    type: 'monthly',
    salary: 45000,
    start: '2026-01-01',
    leaveDate: '2026-04-23',
    bonus: 2000,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };

  const saturday = app.calcRecord({
    empId: emp.id,
    date: '2026-04-18',
    checkIn: '08:00',
    checkOut: '17:00',
    dayType: 'saturday',
    holidayMode: '',
    note: ''
  }, emp);
  assert.equal(saturday.otHours, 8);
  assert.equal(saturday.otPay, 2487);

  const holiday = app.calcRecord({
    empId: emp.id,
    date: '2026-04-20',
    checkIn: '08:00',
    checkOut: '17:00',
    dayType: 'holiday',
    holidayMode: 'pay_day',
    note: ''
  }, emp);
  assert.equal(holiday.otPay, 1567);
});

test('employee with leave date is excluded from future payroll months but kept in historical month snapshots', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-history-only',
    name: '歷史月份員工',
    type: 'monthly',
    salary: 30000,
    start: '2026-01-01',
    leaveDate: '2026-04-07',
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };

  seedData(app, { employees: [emp] });

  assert.equal(app.buildPayrollSnapshots(2026, 4, '').length, 1);
  assert.equal(app.buildPayrollSnapshots(2026, 5, '').length, 0);
});

test('missing attendance anomalies stop after leave date', () => {
  const app = loadApp();
  const emp = {
    id: 'emp-anomaly-stop',
    name: '離職異常截止',
    type: 'monthly',
    salary: 30000,
    start: '2026-04-01',
    leaveDate: '2026-04-07',
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };

  seedData(app, { employees: [emp] });

  const anomalies = app.detectMonthlyAnomalies(2026, 4, '');
  assert.ok(anomalies.length > 0);
  assert.equal(anomalies.some(item => item.date > '2026-04-07'), false);
});

// ─── A 群：請假扣薪費率驗證 ─────────────────────────────────────────────────

test('monthly full-month sick leave deduction: 8h × hourlyRate(125) × 0.5 = 500', () => {
  // hourlyRate = 30000 / 30 / 8 = 125；病假乘數 0.5
  // deduct = Math.round(125 × 8 × 0.5) = 500
  const app = loadApp();
  const emp = {
    id: 'emp-sick-full',
    name: '滿月病假員工',
    type: 'monthly',
    salary: 30000,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };
  seedData(app, {
    employees: [emp],
    leaveRecs: [{
      id: 'leave-sick-full',
      empId: emp.id,
      date: '2026-04-15',
      type: 'sick',
      days: 0,
      hours: 8,
      note: ''
    }]
  });

  const payroll = app.calcMonthlyPayroll(emp, 2026, 4);
  assert.equal(payroll.totalLeaveDeduct, 500);

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.leaveDeduct, 500);
  assert.equal(snapshot.summary.isPartialBase, false);
});

test('monthly full-month personal leave deduction: 4h × hourlyRate(125) × 1.0 = 500', () => {
  // hourlyRate = 30000 / 30 / 8 = 125；事假乘數 1.0
  // deduct = Math.round(125 × 4 × 1.0) = 500
  const app = loadApp();
  const emp = {
    id: 'emp-personal-full',
    name: '滿月事假員工',
    type: 'monthly',
    salary: 30000,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };
  seedData(app, {
    employees: [emp],
    leaveRecs: [{
      id: 'leave-personal-full',
      empId: emp.id,
      date: '2026-04-15',
      type: 'personal',
      days: 0,
      hours: 4,
      note: ''
    }]
  });

  const payroll = app.calcMonthlyPayroll(emp, 2026, 4);
  assert.equal(payroll.totalLeaveDeduct, 500);
});

test('monthly partial-month sick leave uses full monthly salary rate, not prorated rate', () => {
  // 未足月員工（23天）病假費率必須等同滿月：fullAmount/30/8 = 30000/30/8 = 125
  // 若誤用比例後金額：23000/30/8 = 95.83 → 與正確值 125 不同
  // deduct = Math.round(125 × 8 × 0.5) = 500（而非 Math.round(95.83 × 8 × 0.5) = 383）
  const app = loadApp();
  const emp = {
    id: 'emp-sick-partial',
    name: '未足月病假員工',
    type: 'monthly',
    salary: 30000,
    start: '2026-01-01',
    leaveDate: '2026-04-23',
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };
  seedData(app, {
    employees: [emp],
    leaveRecs: [{
      id: 'leave-sick-partial',
      empId: emp.id,
      date: '2026-04-15',
      type: 'sick',
      days: 0,
      hours: 8,
      note: ''
    }]
  });

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.isPartialBase, true);
  assert.equal(snapshot.summary.partialWorkDays, 23);
  assert.equal(snapshot.summary.baseAmount, 23000);
  // 關鍵驗證：請假扣薪與滿月相同（費率用全薪，不用比例後金額）
  assert.equal(snapshot.summary.leaveDeduct, 500);
});

// ─── B 群：伙食津貼流程驗證 ──────────────────────────────────────────────────

test('employee-level meal allowance appears in full-month payroll snapshot', () => {
  // 員工設定伙食津貼 2400，滿月不比例
  // mealAllowance = 2400，netPay = 30000 + 2400 = 32400
  const app = loadApp();
  const emp = {
    id: 'emp-meal-full',
    name: '滿月伙食員工',
    type: 'monthly',
    salary: 30000,
    mealAllowance: 2400,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };
  seedData(app, { employees: [emp] });

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.mealAllowance, 2400);
  assert.equal(snapshot.summary.netPay, 32400);
});

test('employee-level meal allowance is prorated for partial-month employee', () => {
  // 伙食津貼 2400，在職 10 天 → Math.round(2400/30×10) = 800
  // proratedBase = Math.round(30000/30×10) = 10000
  // netPay = 10000 + 800 = 10800
  const app = loadApp();
  const emp = {
    id: 'emp-meal-partial',
    name: '未足月伙食員工',
    type: 'monthly',
    salary: 30000,
    mealAllowance: 2400,
    start: '2026-04-01',
    leaveDate: '2026-04-10',
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: false
  };
  seedData(app, { employees: [emp] });

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.isPartialBase, true);
  assert.equal(snapshot.summary.partialWorkDays, 10);
  assert.equal(snapshot.summary.baseAmount, 10000);
  assert.equal(snapshot.summary.mealAllowance, 800);
  assert.equal(snapshot.summary.netPay, 10800);
});

test('monthly adjustment meal allowance is added to net pay', () => {
  // 員工無伙食津貼，月結手動設定 1800 → netPay = 30000 + 1800 = 31800
  const app = loadApp();
  const emp = {
    id: 'emp-meal-adj',
    name: '月結伙食員工',
    type: 'monthly',
    salary: 30000,
    bonus: 0,
    labor: 0,
    health: 0,
    retirement: 0,
    other: 0,
    active: true
  };
  seedData(app, {
    employees: [emp],
    monthlyPayrollAdjustments: [{
      id: 'adj-meal',
      empId: emp.id,
      month: '2026-04',
      mealAllowance: 1800
    }]
  });

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.mealAllowance, 1800);
  assert.equal(snapshot.summary.netPay, 31800);
});

// ─── C 群：端對端薪資單驗證 ──────────────────────────────────────────────────

test('end-to-end partial-month payroll: prorated base + prorated meal - insurance - sick leave = netPay', () => {
  // 完整計算鏈驗證（未足月 23 天）：
  //   proratedBase   = Math.round(30000/30×23)    = 23000
  //   proratedMeal   = Math.round(1800/30×23)     = 1380
  //   sickLeaveDeduct = Math.round(125×8×0.5)     = 500  ← 費率用全薪 30000/30/8=125
  //   grossBeforeDeduction = 23000 + 1380 - 500   = 23880
  //   deductions     = labor(584) + health(372)   = 956
  //   netPay         = 23880 - 956                = 22924
  const app = loadApp();
  const emp = {
    id: 'emp-e2e-partial',
    name: '端對端未足月員工',
    type: 'monthly',
    salary: 30000,
    mealAllowance: 1800,
    start: '2026-01-01',
    leaveDate: '2026-04-23',
    bonus: 0,
    labor: 584,
    health: 372,
    retirement: 0,
    other: 0,
    active: false
  };
  seedData(app, {
    employees: [emp],
    leaveRecs: [{
      id: 'leave-e2e',
      empId: emp.id,
      date: '2026-04-15',
      type: 'sick',
      days: 0,
      hours: 8,
      note: ''
    }]
  });

  const snapshot = app.buildPayrollSnapshot(emp, 2026, 4);
  assert.equal(snapshot.summary.isPartialBase, true);
  assert.equal(snapshot.summary.partialWorkDays, 23);
  assert.equal(snapshot.summary.baseAmount, 23000);
  assert.equal(snapshot.summary.mealAllowance, 1380);
  assert.equal(snapshot.summary.leaveDeduct, 500);
  assert.equal(snapshot.summary.grossBeforeDeduction, 23880);
  assert.equal(snapshot.summary.deductions, 956);
  assert.equal(snapshot.summary.netPay, 22924);
});
