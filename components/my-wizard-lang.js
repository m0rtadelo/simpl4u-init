import { StaticElement } from 'simpl4u/core/static-element.js';

export class MyWizardLang extends StaticElement {

  constructor() {
    super();
    this.context = 'lang';
  }

  template(state) {
    return `
    <simpl-todo context="${this.context}" id="lang-todo"></simpl-todo>    
    `;
  }
}
customElements.define('my-wizard-lang', MyWizardLang);
