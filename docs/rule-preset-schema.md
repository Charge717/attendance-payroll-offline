# Rule Preset Schema Draft

This draft describes the shape future payroll rule presets should move toward. v2.2 includes a first `companyRules` implementation in `src/index.html`; this document remains the longer-term target for extracting presets into standalone, reviewable rule data.

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

## Current Implementation Status

Implemented in v2.2:

- `DEFAULT_COMPANY_RULES` stores the maintained `tw-2026` defaults inside `src/index.html`.
- `companyRules` is saved in local browser data and JSON backups.
- Older data is normalized with `tw-2026` defaults.
- The Company Rules tab can save a `custom` override for work schedule, lunch break, overtime, holiday default mode, and leave deduction multipliers.
- Regression tests cover default compatibility and custom rule behavior.

Still future work:

1. Extract presets from `src/index.html` into standalone rule modules or JSON.
2. Add stable preset metadata for jurisdiction, effective dates, locale, rounding, and exports.
3. Add external preset review requirements before accepting non-Taiwan jurisdiction presets.

## Review Checklist

Before accepting a new or changed preset:

- The preset has a clear jurisdiction and effective date.
- All sample data is fictional.
- Calculation changes include regression tests.
- Documentation explains assumptions and limits.
- The change does not silently alter the Taiwan preset.
