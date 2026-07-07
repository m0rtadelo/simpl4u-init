# simpl4u-init

Electron 27+ wizard that scaffolds [simpl4u](https://github.com/m0rtadelo/simpl4u) apps from the `skeleton/` template.

## Prerequisites

- **simpl4u must be cloned as a sibling directory** (`../simpl4u`). The wizard imports from `../../simpl4u/...` at runtime.
- Node.js 18+

## Commands

| Command | Action |
|---------|--------|
| `npm start` | Launch wizard (`electron ./main.js`) |
| `npm run lint` | ESLint flat config |
| `npm run lint:fix` | ESLint with `--fix` |

No test framework is installed. No CI or pre-commit hooks exist.

**Dependencies**: Electron `^27.0.0`, ESLint `^9.24.0`, `@eslint/js` `^9.24.0`, `globals` `^16.0.0`.

## Architecture

- **Dual mode**: Runs in Electron (full `window.api` via `api-electron.js` contextBridge — all IPC handlers: `getLocale`, `saveSystem`, `loadSystem`, `writeFile`, `readFile`, `mkdir`, `ls`, `cp`, `rm`, `rmdir`, `exec`, `selectDirectory`) or as browser SPA (limited `api-browser.js` fallback — only `getLocale` + `selectDirectory` returning `null`; file system, IPC, and `exec` are Electron-only).
- **Entry point**: `index.js` imports all 14 wizard components and boots the simpl4u framework.
- **Wizard flow**: `init` (welcome + prerequisite checks for node/npm/git) → `app` (name, window size, languages) → `panels` (CRUD screen list) → `crud` (CRUD field definitions per panel) → `navbar` (navbar settings) → `notyf` (notification defaults) → `confirm` (select destination folder + create). Navigation and per-step validation handled by `my-wizard-footer.js` + `ValidationService`.
- **Skeleton template** (`skeleton/`): copied to the target directory, then `%placeholder` tokens are replaced by `services/create-app.js`.
- **Generated app**: creates `<root>/<name>/`, copies skeleton, clones simpl4u from GitHub, runs `npm install`, then `git init` + `git add .` + `git commit -m "Initial commit"`.
- **Notyf** for notifications, **Bootstrap 5** + Bootstrap Icons for UI.

## Code conventions

- **Custom elements**: files named `my-<name>.js`, define classes extending `simpl4u`'s `StaticElement` or `ReactiveElement`, always followed by `customElements.define('my-<name>', ClassName)` at the bottom of the file.
- **Lifecycle**: override `template()` (returns HTML string with `${}` interpolation), optionally `onReady()`. Event handlers are attribute-based: `(click)="handler"`, `(input)="handler"`, `(change)="handler"`.
- **Imports from simpl4u** use relative paths like `../../simpl4u/core/static-element.js` or `../../simpl4u/services/file-service.js`.
- **Lint**: 2-space indent, single quotes, semicolons, unix linebreaks, `no-console: off`, `no-unused-vars: warn`.

## Skeleton placeholders

`skeleton/` files contain `%holder` tokens. `CreateAppService.replaceHolders()` does `String.replaceAll()` per token. Adding or renaming a placeholder requires updating both `services/create-app.js` and the skeleton file.

| File | Placeholders |
|------|-------------|
| `package.json` | `%name` |
| `index.html` | `%name`, `%theme` |
| `main.js` | `%name`, `%winx`, `%winy`, `%fullscreen`, `%save-window-state` |
| `components/my-app.js` | `%lang_imports`, `%lang_ids`, `%duration`, `%dismissible`, `%positionx`, `%positiony`, `%router_init`, `%name`, `%navbar`, `%app_items` |
| `components/my-navbar.js` | `%title`, `%language-selector`, `%theme-selector`, `%languages`, `%navbar_items`, `%navbar-theme`, `%navbar-icon-setter` |
| `README.md` | `%name` |

## Notable

- The file `components/my-wizzard-app.js` uses the intentional typo "wizzard" — do not rename it.
- Panel types supported by the wizard: `static`, `reactive`, `crud`, `todo`. Each generates a component file in the target app.
- For `crud` panels, the `crud` step lets you define custom field sets per panel using a nested `<simpl-crud>`. Field definitions are stored per panel under `StorageService` context `cf-<panelId>` and consumed by `CreateAppService.createComponentCrud`.
- Wizard persists form state via `StorageService` under key `init-app`.
- `my-simpl-switch.js` is a `ReactiveElement` wrapping `<simpl-switch>` that disables the language selector toggle when fewer than 2 languages are selected.
