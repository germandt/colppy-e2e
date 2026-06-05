# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Playwright E2E test suite for the [Colppy](https://app.colppy.com/) web application, written in TypeScript. Tests run against the live Colppy environment using real credentials.

## Setup

Copy `.env.example` to `.env` and fill in credentials:

```
COLPPY_EMAIL=tu@email.com
COLPPY_PASSWORD=tucontrasena
COLPPY_URL=https://app.colppy.com/
```

Before running authenticated tests for the first time, generate the saved session:

```bash
npm run setup
```

This logs in and saves browser storage state to `.auth/user.json`.

## Commands

```bash
npm test                          # run all tests
npm run test:login                # run login tests only
npm run test:clientes             # run clientes tests only
npm run test:headed               # run all tests with visible browser
npm run test:debug                # run with Playwright inspector
npm run report                    # open last HTML report
npx playwright test --grep "name" # run a single test by name
```

## Architecture

**Page Object Model** — reusable page interactions live in `pages/`. Tests in `tests/` import these classes instead of using locators directly.

**Authentication flow** — `tests/auth.setup.ts` performs the login once and persists the session to `.auth/user.json`. Tests that require an authenticated user load this state via `test.use({ storageState: ... })` at the top of the spec file (see `clientes.spec.ts`). Tests that exercise the login UI itself (`login.spec.ts`) do not use stored state.

**Key config details** (`playwright.config.ts`):
- Runs headed by default (`headless: false`) — the browser window is visible
- `fullyParallel: false` — tests run sequentially to avoid session conflicts
- Retries once on failure; captures screenshots and video on failure
- `baseURL` defaults to `https://app.colppy.com/` but can be overridden via `COLPPY_URL`
