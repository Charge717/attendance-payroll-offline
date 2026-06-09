# ADR-001: Separate UI Localization from Payroll Rule Presets

## Status

Accepted

## Date

2026-06-09

## Context

Attendance Payroll Offline was built primarily for Taiwan attendance and payroll workflows. The project is now public and may attract contributors who can help with English documentation, UI translation, tests, accessibility, and open-source packaging.

However, payroll rules are jurisdiction-specific. Translating UI text into English or another language does not make the Taiwan payroll preset valid for other countries or regions.

The project needs a public message that is welcoming to international developers while remaining honest about the current calculation scope.

## Decision

Separate the project into two conceptual layers:

1. UI and documentation localization.
2. Payroll rule presets.

The maintained built-in rule preset remains Taiwan-focused. The interface and documentation may be multilingual, but any future country or region support must be implemented as a named rule preset with tests, documentation, and a clear jurisdiction label.

## Alternatives Considered

### Keep the project mostly Chinese-only

Pros:

- Reduces risk that non-Taiwan users misunderstand the payroll rules.
- Keeps documentation close to the current primary users.

Cons:

- Makes it harder for international developers to contribute to UI, tests, privacy tooling, and documentation.
- Makes the open-source repo look less accessible.

Rejected because the project benefits from international contributors, as long as rule boundaries are clear.

### Market the app as a global payroll tool

Pros:

- Broader appeal.
- Simpler English marketing message.

Cons:

- Misleading because payroll law differs by jurisdiction.
- Creates legal and product risk.
- Encourages contributors to make calculation changes without local rule context.

Rejected because the current tested preset is Taiwan-focused.

### Build every jurisdiction immediately

Pros:

- Would make the app broadly usable.

Cons:

- Requires legal/payroll expertise and test data for each jurisdiction.
- Too large for the current code structure.
- Risks damaging the tested Taiwan behavior.

Rejected for now. Future presets should be added incrementally.

## Consequences

- README and GitHub metadata describe the app as multilingual with a tested Taiwan payroll preset.
- Translation contributions are welcome but cannot change calculation behavior.
- Payroll-rule changes require tests and documentation.
- Other jurisdictions must be proposed as separate rule presets.
- Future refactoring should extract locale dictionaries and rule presets from the single HTML app.
