# simpl4u-init

A wizard-based project scaffolder for creating [Electron](https://www.electronjs.org) applications using the [simpl4u](https://github.com/m0rtadelo/simpl4u) framework.

## How it works

`simpl4u-init` provides an interactive wizard that guides you through creating a new Electron app step by step:

1. **App configuration** — name, window dimensions, fullscreen mode
2. **Navigation bar** — title, language and theme selectors
3. **Languages** — select i18n support (English, Spanish, Catalan, German, Japanese)
4. **Notifications** — configure notyf duration, dismissible, position
5. **Panels** — add pages to your app (static, reactive, CRUD, or todo)
6. **Destination** — choose the output folder and confirm

Once confirmed, it copies the [skeleton](./skeleton) template, generates the requested components and i18n assets, installs npm dependencies, and initializes a git repository.

## Getting started

```sh
git clone https://github.com/m0rtadelo/simpl4u-init.git
git clone https://github.com/m0rtadelo/simpl4u.git
cd simpl4u-init
npm i
npm start
```

The wizard will walk you through creating your new app.

## Project structure

```
simpl4u-init/
├── api-browser.js       # Browser IPC fallback
├── api-electron.js      # Electron preload API
├── components/          # Wizard UI components
│   ├── my-app.js
│   ├── my-init.js
│   ├── my-navbar.js
│   ├── my-panel-languages.js
│   ├── my-panel-notyf.js
│   ├── my-panel-window.js
│   ├── my-simpl-switch.js
│   ├── my-wizard-app.js
│   ├── my-wizard-confirm.js
│   ├── my-wizard-footer.js
│   ├── my-wizard-lang.js
│   ├── my-wizard-navbar.js
│   ├── my-wizard-notyf.js
│   └── my-wizard-panels.js
├── services/
│   ├── create-app.js          # App generation logic
│   └── validation.service.js  # Form validation
├── skeleton/                  # Template for new apps
│   ├── components/
│   ├── services/
│   ├── main.js
│   ├── index.js
│   └── index.html
├── main.js                    # Electron main process
└── index.html                 # Wizard entry point
```

## Requirements

- [Node.js](https://nodejs.org) 18+
- [simpl4u](https://github.com/m0rtadelo/simpl4u) (cloned as a sibling directory)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Launch the wizard |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix lint issues |
