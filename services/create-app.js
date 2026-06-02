import { FileService } from '../../simpl4u/services/file-service.js';
import { ModalService } from '../../simpl4u/services/modal-service.js';
import { SpinnerService } from '../../simpl4u/services/spinner-service.js';
export class CreateAppService {
  static async createApp(model) {
    try {
      await this.checkPrerequisites();
      const root = `${model.root}/${model.name}`;
      console.log(model);

      SpinnerService.show();
      await this.copySkeletonStructure(root, model);
      await this.setWindow(root, model);
      await this.setAppName(root, model);
      await this.setRouter(root, model);
      await this.setNavBar(root, model);
      await this.setLanguages(root, model);
      await this.setNotyf(root, model);
      await this.setPanels(root, model);
      await this.postGenerationSteps(root);
      SpinnerService.hide();
      ModalService.message(`App ${model.name} created at ${root}`, 'Success');
    } catch (error) {
      SpinnerService.hide();
      console.error(error);
      ModalService.message(`Error creating app: ${error.message}`, 'Error');
    }
  }

  static async checkPrerequisites() {
    const checks = [
      { cmd: 'node --version', name: 'Node.js' },
      { cmd: 'npm --version', name: 'npm' },
      { cmd: 'git --version', name: 'Git' },
    ];
    const missing = [];
    for (const { cmd, name } of checks) {
      const result = await window.api.exec(cmd);
      if (result.error) missing.push(name);
    }
    if (missing.length) {
      throw new Error(`Missing prerequisites: ${missing.join(', ')}. Please install them and try again.`);
    }
  }

  static async copySkeletonStructure(root, model) {
    await FileService.mkdir(root);
    await FileService.cp('./skeleton', root, { recursive: true });
    const simpl4uTarget = `${model.root}/simpl4u`;
    const exists = await FileService.ls(simpl4uTarget);
    if (exists) {
      SpinnerService.hide();
      const result = await ModalService.confirm(
        'A simpl4u folder already exists in the target directory. Do you want to overwrite it?',
        'Warning'
      );
      if (result) {
        await FileService.rm(simpl4uTarget, { recursive: true, force: true });
        const cloneResult = await window.api.exec('git clone https://github.com/m0rtadelo/simpl4u simpl4u', { cwd: model.root, timeout: 120000 });
        if (cloneResult.error) throw new Error(`Failed to clone simpl4u: ${cloneResult.stderr}`);
      }
    } else {
      const cloneResult = await window.api.exec('git clone https://github.com/m0rtadelo/simpl4u simpl4u', { cwd: model.root, timeout: 120000 });
      if (cloneResult.error) throw new Error(`Failed to clone simpl4u: ${cloneResult.stderr}`);
    }
    SpinnerService.show();
  }

  static async setPanels(root, model) {
    if (!model.data?.length) {
      await this.replaceHolders(root, '/components/my-app.js', 'app_items', ' ');
      await this.replaceHolders(root, '/components/my-navbar.js', 'navbar_items', ' ');
      return;
    }

    let appItems = '';
    let navbarItems = '';
    const allImports = [];

    for (const panel of model.data) {
      appItems += `\${ v === '${panel.id}' ? '<my-${panel.id}></my-${panel.id}>' : '' }\n`;
      if (!panel['Hidden in Navbar']) {
        navbarItems += `{ id: '${panel.id}', name: '${panel.Label}' }, `;
      }
      const imports = await this.createComponent(root, panel);
      allImports.push(...imports);
    }

    await this.replaceHolders(root, '/components/my-app.js', 'app_items', appItems);
    await this.replaceHolders(root, '/components/my-navbar.js', 'navbar_items', navbarItems);

    let indexContent = await FileService.readFile(`${root}/index.js`, 'utf-8');
    indexContent += '\n' + allImports.join('\n');
    await FileService.writeFileSync(`${root}/index.js`, indexContent, { encoding: 'utf-8' });
  }

  static async createComponent(root, panel) {
    switch (panel.Type) {
    case 'reactive':
      return await this.createComponentReactive(root, panel);
    case 'crud':
      return await this.createComponentCrud(root, panel);
    case 'todo':
      return await this.createComponentTodo(root, panel);
    case 'static':
    default:
      return await this.createComponentStatic(root, panel);
    }
  }

  static panelClassName(id) {
    return `My${id.charAt(0).toUpperCase()}${id.slice(1)}`;
  }

  static async createComponentStatic(root, panel) {
    const className = this.panelClassName(panel.id);
    await FileService.writeFileSync(
      `${root}/components/my-${panel.id}.js`,
      `import { StaticElement } from '../../simpl4u/core/static-element.js';

export class ${className} extends StaticElement {
  template() {
    return \`
      <h1>${panel.Label}</h1>
    \`;
  }
}
customElements.define('my-${panel.id}', ${className});`,
      { encoding: 'utf-8' }
    );
    return [`import { ${className} } from './components/my-${panel.id}.js';`];
  }

  static async createComponentReactive(root, panel) {
    const className = this.panelClassName(panel.id);
    await FileService.writeFileSync(
      `${root}/components/my-${panel.id}.js`,
      `import { ReactiveElement } from '../../simpl4u/core/reactive-element.js';

export class ${className} extends ReactiveElement {
  constructor() {
    super();
    this.context = '${panel.id}';
  }

  template(state) {
    return \`
      <h1>${panel.Label}</h1>
      <pre>\${JSON.stringify(state, null, 2)}</pre>
    \`;
  }
}
customElements.define('my-${panel.id}', ${className});`,
      { encoding: 'utf-8' }
    );
    return [`import { ${className} } from './components/my-${panel.id}.js';`];
  }

  static async createComponentCrud(root, panel) {
    const className = this.panelClassName(panel.id);
    await FileService.writeFileSync(
      `${root}/components/my-${panel.id}.js`,
      `import { StaticElement } from '../../simpl4u/core/static-element.js';

export class ${className} extends StaticElement {
  constructor() {
    super();
    this.context = '${panel.id}';
  }

  template() {
    return \`
      <simpl-crud id="crud" context="\${this.context}"></simpl-crud>
    \`;
  }

  onReady() {
    const crud = this.get('crud');
    crud.setHeaders(['name', 'description']);
    crud.setForm([
      { name: 'id', disabled: true, hidden: true, unique: true, index: true },
      { name: 'name', required: true, class: 'col-12', unique: true },
      { name: 'description', class: 'col-12' },
    ]);
  }
}
customElements.define('my-${panel.id}', ${className});`,
      { encoding: 'utf-8' }
    );
    return [`import { ${className} } from './components/my-${panel.id}.js';`];
  }

  static async createComponentTodo(root, panel) {
    const className = this.panelClassName(panel.id);
    const formClassName = `${className}Form`;

    await FileService.writeFileSync(
      `${root}/components/my-${panel.id}.js`,
      `import { StaticElement } from '../../simpl4u/core/static-element.js';

export class ${className} extends StaticElement {
  constructor() {
    super();
    this.search = '';
    this.context = '${panel.id}';
  }

  template() {
    return \`
      <div class="row">
        <div class="col-12">
          <div class="input-group mt-4">
            <input type="text" id="search" (input)="filter" class="form-control" value="\${this.search || ''}" placeholder="Filter...">
            <button class="btn btn-outline-secondary" (click)="clear" type="button">Clear</button>
          </div>
        </div>
      </div>
      <simpl-todo context="\${this.context}" id="simpl-todo" form="my-${panel.id}-form"></simpl-todo>
    \`;
  }

  onReady() {
    setTimeout(() => this.get('search')?.focus(), 300);
    this.get('simpl-todo')?.onRenderItems(this.renderItems.bind(this));
  }

  renderItems(state, type) {
    let result = '';
    (state[type] || []).forEach((item, index) => {
      item = item || {};
      item.id = item.id || \`\${type}_\${index}\`;
      result += \`
        <div class="card mb-2" id="\${item.id}">
          <div class="card-body">
            <div class="text-break fw-semibold">\${item.title || ''}</div>
            <small class="text-break fw-light">\${item.description || ''}</small>
          </div>
        </div>\`;
    });
    return result;
  }

  filter(event) {
    this.search = event.target.value;
  }

  clear() {
    this.search = '';
    this.refresh();
  }
}
customElements.define('my-${panel.id}', ${className});`,
      { encoding: 'utf-8' }
    );

    await FileService.writeFileSync(
      `${root}/components/my-${panel.id}-form.js`,
      `import { StaticElement } from '../../simpl4u/core/static-element.js';

export class ${formClassName} extends StaticElement {
  template() {
    return \`
      <div class="row">
        <simpl-input context="\${this.context}" name="title" label="Title" required="true"></simpl-input>
        <simpl-textarea context="\${this.context}" name="description" label="Description"></simpl-textarea>
      </div>
    \`;
  }

  onReady() {
    setTimeout(() => document.querySelector('input[name="title"]')?.focus(), 500);
  }
}
customElements.define('my-${panel.id}-form', ${formClassName});`,
      { encoding: 'utf-8' }
    );

    return [
      `import { ${className} } from './components/my-${panel.id}.js';`,
      `import { ${formClassName} } from './components/my-${panel.id}-form.js';`,
    ];
  }

  static async setWindow(root, model) {
    await this.replaceHolders(root, '/main.js', 'winx', model.winx);
    await this.replaceHolders(root, '/main.js', 'winy', model.winy);
    await this.replaceHolders(root, '/main.js', 'fullscreen', model.fullscreen ? 'true' : 'false');
  }

  static async setAppName(root, model) {
    await this.replaceHolders(root, '/README.md', 'name', model.name);
    await this.replaceHolders(root, '/package.json', 'name', model.name);
    await this.replaceHolders(root, '/index.html', 'name', model.name);
    await this.replaceHolders(root, '/components/my-app.js', 'name', model.name);
  }

  static async setRouter(root, model) {
    if (model.data?.length) {
      await this.replaceHolders(root, '/components/my-app.js', 'router_init',
        `RouterService.view = '${model.data[0].id}'; // Set initial view`);
    } else {
      await this.replaceHolders(root, '/components/my-app.js', 'router_init',
        '// RouterService.view = \'\'; // Set initial view');
    }
  }

  static async setNavBar(root, model) {
    if (model.navbar) {
      await this.replaceHolders(root, '/components/my-app.js', 'navbar', '<my-navbar></my-navbar>');
      await this.replaceHolders(root, '/components/my-navbar.js', 'title', model.title);
      await this.replaceHolders(root, '/components/my-navbar.js', 'language-selector',
        (!model['language-selector'] || model.lang?.length < 2) ? 'true' : 'false');
      await this.replaceHolders(root, '/components/my-navbar.js', 'theme-selector',
        model['theme-selector'] ? 'false' : 'true');
    } else {
      await this.replaceHolders(root, '/components/my-app.js', 'navbar', ' ');
      await FileService.rm(`${root}/components/my-navbar.js`, { force: true });
      let indexContent = await FileService.readFile(`${root}/index.js`, 'utf-8');
      indexContent = indexContent.replace(/import.*MyNavBar.*;\n?/, '');
      await FileService.writeFileSync(`${root}/index.js`, indexContent, { encoding: 'utf-8' });
    }
  }

  static async setNotyf(root, model) {
    await this.replaceHolders(root, '/components/my-app.js', 'duration', model.duration);
    await this.replaceHolders(root, '/components/my-app.js', 'dismissible', model.dismissible);
    await this.replaceHolders(root, '/components/my-app.js', 'positionx', model.positionx);
    await this.replaceHolders(root, '/components/my-app.js', 'positiony', model.positiony);
  }

  static async setLanguages(root, model) {
    const map = {
      'English': { id: 'en', name: 'English', import: 'import { words as en } from \'../assets/i18n/en.js\';' },
      'Español': { id: 'es', name: 'Español', import: 'import { words as es } from \'../assets/i18n/es.js\';' },
      'Català': { id: 'ca', name: 'Català', import: 'import { words as ca } from \'../assets/i18n/ca.js\';' },
      'Deutsch': { id: 'de', name: 'Deutsch', import: 'import { words as de } from \'../assets/i18n/de.js\';' },
      '日本語': { id: 'ja', name: '日本語', import: 'import { words as ja } from \'../assets/i18n/ja.js\';' },
    };

    const custom = [];
    for (const lang of model.lang) {
      const entry = map[lang];
      if (!entry) continue;
      custom.push(entry);
      await FileService.writeFileSync(
        `${root}/assets/i18n/${entry.id}.js`,
        `export const words = {\n  title: '${model.title}'\n};`,
        { encoding: 'utf-8' }
      );
    }

    const ids = custom.map(c => c.id).join(', ');
    const imports = custom.map(c => c.import).join('\n');
    const languages = custom.map(c => `{ id: '${c.id}', name: '${c.name}' }`).join(',\n');

    await this.replaceHolders(root, '/components/my-app.js', 'lang_imports', imports);
    await this.replaceHolders(root, '/components/my-app.js', 'lang_ids', ids);
    await this.replaceHolders(root, '/components/my-navbar.js', 'languages', languages);
  }

  static async postGenerationSteps(root) {
    const npmResult = await window.api.exec('npm install', { cwd: root, timeout: 120000 });
    if (npmResult.error) {
      console.error('npm install failed:', npmResult.stderr);
    }
    const gitInitResult = await window.api.exec('git init', { cwd: root, timeout: 30000 });
    if (gitInitResult.error) {
      console.error('git init failed:', gitInitResult.stderr);
      return;
    }
    const gitAddResult = await window.api.exec('git add .', { cwd: root, timeout: 30000 });
    if (gitAddResult.error) {
      console.error('git add failed:', gitAddResult.stderr);
      return;
    }
    const gitCommitResult = await window.api.exec('git commit -m "Initial commit"', { cwd: root, timeout: 30000 });
    if (gitCommitResult.error) {
      console.error('git commit failed:', gitCommitResult.stderr);
    }
  }

  static async replaceHolders(root, file, holder, value) {
    const path = root + file;
    const content = await FileService.readFile(path, 'utf-8');
    if (content === null) {
      console.error(`File not found: ${path}`);
      return;
    }
    const newContent = content.replaceAll(`%${holder}`, value !== undefined ? value : '');
    await FileService.writeFileSync(path, newContent, { encoding: 'utf-8' });
  }
}
