# Copilot / AI agent instructions for PlaywrightAutomation

This repository is a Playwright (TypeScript) test suite using a Page Object Model under `pages/` and tests in `tests/`.

Keep answers focused and actionable — modify files only when you can add clear, repository-specific value.

Important project entry points and commands
- Repository root: run tests with `npm run regression` (maps to `npx playwright test`).
- Useful scripts: `npm run e2eTests`, `apiTests`, `smokeTests`, `mobileTests`, `report`, `allure:generate`, `allure:open` (see `package.json`).
- Playwright configs: `playwright.config.ts`, `playwright.configMobilePorts.ts` — prefer the mobile config for mobile port runs.

Key patterns and conventions (do not invent alternatives)
- Tests: under `tests/` use `@playwright/test` fixtures. Examples: `tests/loginSessionStorage.spec.ts`, `tests/testOnly.spec.ts`.
- Page Object Model: the `pages/` directory contains reusable UI abstractions — prefer updating or adding page objects instead of inlining selectors in tests.
- Session/state handling: this project saves storage state to files (examples: `loginSessionStorage.json`, `state.json`) and loads contexts with `browser.newContext({ storageState: '...' })`. These files are gitignored; tests rely on them being created at runtime.
- Allure reporting: tests produce results under `allure-results/`. Use `npm run allure:generate` then `npm run allure:open` to view reports.

Testing & debugging tips specific to this repo
- To run a single test file (example observed in CI/terminal):
  npx playwright test tests/loginAPIWithCSRF.spec.ts --project='Desktop Chrome (Chromium)' --workers=1
- Useful local flags: `--headed`, `--debug`, `--trace on`, `--list` (available via `package.json` scripts).
- When adding or modifying tests, prefer creating a `test.beforeAll` that captures `storageState` where auth is required, matching patterns in `tests/loginSessionStorage.spec.ts`.

Integration points & dependencies
- Allure: `allure-playwright` + `allure-commandline` are present in devDependencies — keep report artifacts in `allure-results/`.
- Cucumber and `exceljs` are present as dependencies but most tests use `@playwright/test`. If adding BDD features, follow existing conventions; otherwise prefer Playwright test runners.

Style and PR guidance for AI edits
- Keep changes minimal and well-scoped. Update `pages/` objects when changing selectors used across tests.
- Add or update tests only when you can run them or provide explicit commands to reproduce failures.
- When suggesting changes to configs (`playwright.config*.ts`), include exact lines to modify and explain why.

Examples (copyable patterns from repo)
- Save login state (from `tests/loginSessionStorage.spec.ts`):
  ```ts
  await context.storageState({ path: 'loginSessionStorage.json' });
  webContext = await browser.newContext({ storageState: 'loginSessionStorage.json' });
  ```
- Create a persistent authenticated context (from `tests/testOnly.spec.ts`):
  ```ts
  await context.storageState({ path: 'state.json' });
  browserContext = await browser.newContext({ storageState: 'state.json' });
  ```

What not to change without asking
- Do not commit `state.json` or `loginSessionStorage.json` (they are in `.gitignore`).
- Avoid large refactors of the testing framework (switching to Jest, changing runner) without developer approval.

Questions for maintainers (ask in PR description)
- Preferred timeout and waiting strategy for flaky selectors?
- Any intended use for Cucumber in this repository (currently tests use Playwright)?

If something is unclear, ask for a small reproducible example (test name + failing output) before making breaking changes.
