import { StaticElement } from '../../simpl4u/core/static-element.js';

export class MyWizardApp extends StaticElement {
  template() {
    return `
      <div class="row" style="margin-top: 20px">
        <simpl-input (change)="onNameChange" required class="col-12" id="name" label="App Name" placeholder="Enter your app name"></simpl-input>
      </div>
      <my-panel-window></my-panel-window>
      <my-panel-languages></my-panel-languages>
      <my-wizard-footer></my-wizard-footer>
    
    `;
  }

  onNameChange() {
    this.setField('title', this.getField('name'));
  }

  onReady() {
    this.get('name').focus();
  }
}
customElements.define('my-wizard-app', MyWizardApp);
