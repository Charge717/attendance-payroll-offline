# Rule Preset Schema Draft

This draft describes the shape future payroll rule presets should move toward. It is documentation only; the current application still uses the existing Taiwan-focused logic in `src/index.html`.

The goal is to make future rule changes reviewable, testable, and clearly tied to a jurisdiction.

## Design Principles

- A preset describes calculation assumptions; it does not provide legal advice.
- Every preset must have an ID, jurisdiction, effective date, and test coverage.
- UI language is separate from payroll rules.
- Taiwan behavior should stay in a named Taiwan preset instead of being renamed as generic behavior.
- Custom settings should be explicit and user-controlled.

## Draft Shape

```ts
type RulePreset = {
  id: string;
  label: string;
  jurisdiction: {
    countryCode: string;
    region?: string;
    effectiveFrom: string;
    effectiveTo?: string;
    notes: string;
  };
  locale: {
    defaultLanguage: string;
    currency: string;
    dateFormat: string;
  };
  workSchedule: {
    defaultWorkDays: number[];
    standardStart: string;
    standardEnd: string;
    unpaidBreaks: Array<{
      label: string;
      start: string;
      end: string;
    }>;
  };
  overtime: {
    categories: Array<{
      id: string;
      label: string;
      multiplier: number;
      notes?: string;
    }>;
  };
  leaveTypes: Array<{
    id: string;
    label: string;
    paidRatio: number;
    unit: "hour" | "day" | "minute";
    affectsAttendanceWarnings: boolean;
  }>;
  payrollItems: {
    allowances: string[];
    deductions: string[];
    insuranceTables: string[];
  };
  rounding: {
    minutes: "none" | "nearest-minute";
    currency: "round" | "floor" | "ceil";
  };
  exports: {
    payslipLabels: Record<string, string>;
    workbookSheetNames: Record<string, string>;
  };
};
```

## Example: Taiwan Preset Stub

```json
{
  "id": "tw-2026",
  "label": "Taiwan payroll preset 2026",
  "jurisdiction": {
    "countryCode": "TW",
    "effectiveFrom": "2026-01-01",
    "notes": "Current maintained Taiwan-oriented attendance and payroll behavior."
  },
  "locale": {
    "defaultLanguage": "zh-TW",
    "currency": "TWD",
    "dateFormat": "YYYY-MM-DD"
  },
  "workSchedule": {
    "defaultWorkDays": [1, 2, 3, 4, 5],
    "standardStart": "08:00",
    "standardEnd": "17:00",
    "unpaidBreaks": [
      {
        "label": "Lunch break",
        "start": "12:00",
        "end": "13:00"
      }
    ]
  }
}
```

## Migration Path

1. Keep the current payroll regression tests passing.
2. Identify calculation constants currently embedded in `src/index.html`.
3. Move one low-risk group of settings into a read-only preset object.
4. Add tests proving the extracted preset produces the same result.
5. Add a `custom` preset only after the Taiwan preset extraction is stable.

## Review Checklist

Before accepting a new or changed preset:

- The preset has a clear jurisdiction and effective date.
- All sample data is fictional.
- Calculation changes include regression tests.
- Documentation explains assumptions and limits.
- The change does not silently alter the Taiwan preset.
