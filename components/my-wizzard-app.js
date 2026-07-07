import { StaticElement } from 'simpl4u/core/static-element.js';

export class MyWizardApp extends StaticElement {
  template() {
    return `
      <div class="row" style="margin-top: 20px">
        <simpl-input (change)="onNameChange" required class="col-12" id="name" label="App Name" placeholder="Enter your app name"></simpl-input>
      </div>
      <my-panel-window></my-panel-window>
      <div class="card" style="margin-top: 20px">
        <div class="card-header">Default App Theme</div>
        <div class="card-body">
          <div class="card-text row">
            <simpl-select class="col-12" id="app-theme" label="Default theme" items='[{"id": "auto", "text": "Auto (follow system)"},{"id": "dark", "text": "Dark"},{"id": "light", "text": "Light"}]'></simpl-select>
          </div>
        </div>
      </div>
      <my-panel-languages></my-panel-languages>
      <my-wizard-footer></my-wizard-footer>
    
    `;
  }

  onNameChange() {
    this.setField('title', this.getField('name'));
  }

  onReady() {
    setTimeout(() => {
      this.get('name').focus();
    }, 300);
  }
}
customElements.define('my-wizard-app', MyWizardApp);
