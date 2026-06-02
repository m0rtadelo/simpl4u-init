import { StaticElement } from '../../simpl4u/core/static-element.js';
import { RouterService } from '../../simpl4u/services/router-service.js';
import { StorageService } from '../../simpl4u/services/storage-service.js';

export class MyApp extends StaticElement {

  constructor() {
    super();
    this.initApp();
  }

  initApp() {
    document.title = 'Init App Wizard (v1.0.0) - Simpl4u';
    RouterService.view = 'init';
    StorageService.key = 'init-app';

    this.model = {};
    this.setField('winx', 1100);
    this.setField('winy', 800);
    this.setField('fullscreen', false);
    this.setField('lang', ['English', 'Español', 'Català']);
    this.setField('language-selector', true);
    this.setField('navbar', true);
    this.setField('theme-selector', true);
    this.setField('duration', 5000);
    this.setField('dismissible', true);
    this.setField('positionx', 'right');
    this.setField('positiony', 'top');
    this.setField('data', [
      { id: 'home', Label: 'Home', Type: 'static'}
    ]);
  }

  template() {
    const v = RouterService.view;
    return `
    <my-navbar></my-navbar>
    <div class="container-fluid">
      <div class="row">
        ${ v === 'init' ? '<my-init></my-init>' : '' }
        ${ v === 'app' ? '<my-wizard-app></my-wizard-app>' : '' }
        ${ v === 'panels' ? '<my-wizard-panels></my-wizard-panels>' : '' }
        ${ v === 'crud' ? '<my-wizard-crud-fields></my-wizard-crud-fields>' : '' }
        ${ v === 'lang' ? '<my-wizard-lang></my-wizard-lang>' : '' }
        ${ v === 'navbar' ? '<my-wizard-navbar></my-wizard-navbar>' : '' }
        ${ v === 'notyf' ? '<my-wizard-notyf></my-wizard-notyf>' : '' }
        ${ v === 'confirm' ? '<my-wizard-confirm></my-wizard-confirm>' : '' }
      </div>
    </div>
    <simpl-spinner></simpl-spinner>
        `;
  }
}
customElements.define('my-app', MyApp);
