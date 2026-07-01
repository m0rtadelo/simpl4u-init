import { StaticElement } from 'simpl4u/core/static-element.js';

export class MyWizardNotyf extends StaticElement {
  template() {
    return `
    <div style="margin-top: 20px;"></div>
    <my-panel-notyf></my-panel-notyf>
    <my-wizard-footer></my-wizard-footer>`;
  }
}
customElements.define('my-wizard-notyf', MyWizardNotyf);
