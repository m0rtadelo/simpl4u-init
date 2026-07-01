import { FileService } from 'simpl4u/services/file-service.js';

export class ComponentBuilder {
  static panelClassName(id) {
    return `My${id.charAt(0).toUpperCase()}${id.slice(1)}`;
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

  static async createComponentStatic(root, panel) {
    const className = this.panelClassName(panel.id);
    await FileService.writeFileSync(
      `${root}/components/my-${panel.id}.js`,
      `import { StaticElement } from 'simpl4u/core/static-element.js';

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
      `import { ReactiveElement } from 'simpl4u/core/reactive-element.js';

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
    const fields = panel._fields;

    let headersCode = '[\'name\', \'description\']';
    let formCode = `[
      { name: 'id', disabled: true, hidden: true, unique: true, index: true },
      { name: 'name', required: true, class: 'col-12', unique: true },
      { name: 'description', class: 'col-12' },
    ]`;

    if (fields?.length) {
      const headers = fields.filter(f => !f.hidden).map(f => `'${f.name}'`);
      headersCode = `[${headers.join(', ')}]`;

      formCode = JSON.stringify(fields, null, 4);
    }

    await FileService.writeFileSync(
      `${root}/components/my-${panel.id}.js`,
      `import { StaticElement } from 'simpl4u/core/static-element.js';
import { LanguageService } from 'simpl4u/services/language-service.js';
/** @typedef {import('simpl4u/components/simpl-crud.js').FormDefinition} FormDefinition */

export class ${className} extends StaticElement {
  constructor() {
    super();
    this.context = '${panel.id}';
  }

  template() {
    return \`
      <div class="input-group mt-4">
        <input type="text" id="search-${panel.id}" (input)="setFilter" name="filter" autofocus="true" class="form-control" value="\${this.data['filter'] || ''}" placeholder="\${LanguageService.i18n('filter-text')}" aria-label="\${LanguageService.i18n('filter-text')}" aria-describedby="button-clear">
        <button class="btn btn-outline-secondary" type="button" (click)="clearFilter">\${LanguageService.i18n('clear')}</button>
      </div>
      <simpl-crud id="crud" context="\${this.context}"></simpl-crud>
    \`;
  }

  onReady() {
    const crud = this.get('crud');
    crud.setHeaders(${headersCode});
    /** @type {FormDefinition[]} */
    const fields = ${formCode};
    crud.setForm(fields);
  }

  setFilter(event) {
    this.setField('filter', event.target.value);
  }

  clearFilter() {
    this.setField('filter', '');
    this.get('search-${panel.id}').value = '';
    setTimeout(() => {this.get('search-${panel.id}').focus();}, 300);
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
      `import { StaticElement } from 'simpl4u/core/static-element.js';

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
      `import { StaticElement } from 'simpl4u/core/static-element.js';

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

  static async createImportExportComponent(root) {
    await FileService.writeFileSync(
      `${root}/components/my-settings.js`,
      `import { StaticElement } from 'simpl4u/core/static-element.js';
import { LanguageService } from 'simpl4u/services/language-service.js';
import { ToastService } from 'simpl4u/services/toast-service.js';
import { FileService } from 'simpl4u/services/file-service.js';
import { StorageService } from 'simpl4u/services/storage-service.js';

export class MySettings extends StaticElement {
  files;

  template() {
    return \`
      <div class="row">
        <div class="col-12 col-md-5 mt-3">
          <div class="card">
            <div class="card-header">\${LanguageService.i18n('export-data-to-file')}</div>
            <div class="card-body mt-3">
              <simpl-button (click)="export" class="d-grid">\${LanguageService.i18n('export-data')}</simpl-button>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7 mt-3">
          <div class="card">
            <div class="card-header">\${LanguageService.i18n('restore-data-from-backup-file')}</div>
            <div class="card-body mt-3">
              <div class="row">
                <div class="col-9">
                  <simpl-file (change)="change" id="file"></simpl-file>
                </div>
                <div class="col-3">
                  <simpl-button (click)="import" class="d-grid">\${LanguageService.i18n('restore-data')}</simpl-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    \`;
  }

  change(event) {
    this.files = event.target.files;
  }

  async import() {
    const file = this.files?.item?.(0);
    if (!file) {
      ToastService.error(LanguageService.i18n('no-file-selected'));
      return;
    }
    try {
      const content = await file.text();
      const json = JSON.parse(content);
      await StorageService.saveAppModel(json);
      StorageService.saveUserModel(json);
      this.model = json;
      window.location.reload();
    } catch (error) {
      console.error(error);
      ToastService.error(LanguageService.i18n('error-importing-data'));
    }
  }

  async export() {
    const data = await StorageService.loadAppModel();
    FileService.download('export.json', data);
  }
}
customElements.define('my-settings', MySettings);`,
      { encoding: 'utf-8' }
    );
    return ['import { MySettings } from \'./components/my-settings.js\';'];
  }
}
