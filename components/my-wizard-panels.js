import { StaticElement } from '../../simpl4u/core/static-element.js';
/** @typedef {import('../../simpl4u/components/simpl-crud.js').FormDefinition} FormDefinition */

export class MyWizardPanels extends StaticElement {
  template() {
    return `
      <simpl-crud id="screens" actions="crud"></simpl-crud>
      <my-wizard-footer></my-wizard-footer>
      `;
  }

  onReady() {
    const screens = this.get('screens');
    const types = [
      { id: 'static', text: 'Static Element' },
      { id: 'reactive', text: 'Reactive Element' },
      { id: 'crud', text: 'CRUD Element' },
      { id: 'todo', text: 'ToDo Element' },
    ];
    screens.setHeaders(['id', 'Label', 'Type']);
    /** @type {FormDefinition[]} */
    const formFields = [
      { name: 'id', required: true, class: 'col-4', unique: true },
      { name: 'Label', required: true, class: 'col-8', unique: true },
      { name: 'Type', class: 'col-12', required: true, type: 'select', items: JSON.stringify(types) },
      { name: 'Hidden in Navbar', class: 'col-12', type: 'switch' },
    ];
    screens.setForm(formFields);
  }
}
customElements.define('my-wizard-panels', MyWizardPanels);
