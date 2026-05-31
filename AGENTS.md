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

## Architecture

- **Dual mode**: Runs in Electron (full `window.api` via `api-electron.js` contextBridge) or as browser SPA (limited `api-browser.js` fallback — `selectDirectory` returns `null`).
- **Skeleton template** (`skeleton/`): copied to the target directory, then `%placeholder` tokens are replaced by `services/create-app.js`.
- **Generated app**: creates `<root>/<name>/`, copies skeleton, clones simpl4u from GitHub, runs `npm install`, then `git init` + `git add .` + `git commit -m "Initial commit"`.
- **Notyf** for notifications, **Bootstrap 5** + Bootstrap Icons for UI.

## Code conventions

- **Custom elements**: files named `my-<name>.js`, define classes extending `simpl4u`'s `StaticElement` or `ReactiveElement`, always followed by `customElements.define('my-<name>', ClassName)` at the bottom of the file.
- **Lifecycle**: override `template()` (returns HTML string with `${}` interpolation), optionally `onReady()`. Event handlers are attribute-based: `(click)="handler"`, `(input)="handler"`, `(change)="handler"`.
- **Imports from simpl4u** use relative paths like `../../simpl4u/core/static-element.js` or `../../simpl4u/services/file-service.js`.
- **Lint**: 2-space indent, single quotes, semicolons, unix linebreaks, `no-console: off`, `no-unused-vars: warn`.

## Skeleton placeholders

`skeleton/` files contain `%holder` tokens. `CreateAppService.replaceHolders()` does a single `String.replace()` per token. Adding or renaming a placeholder requires updating both `services/create-app.js` and the skeleton file.

## Notable

- The file `components/my-wizzard-app.js` uses the intentional typo "wizzard" — do not rename it.
- Panel types supported by the wizard: `static`, `reactive`, `crud`, `todo`. Each generates a component file in the target app.
- Wizard persists form state via `StorageService` under key `init-app`.
