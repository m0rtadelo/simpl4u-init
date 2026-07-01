import { ReactiveElement } from 'simpl4u/core/reactive-element.js';

export class MyWizardCrudFields extends ReactiveElement {
  timer;

  onReady() {
    const crudPanels = this.getCrudPanels();
    if (crudPanels.length > 0) {
      const current = this.getField('panel-select');
      if (!current || !crudPanels.find(p => p.id === current)) {
        this.setField('panel-select', crudPanels[0].id);
      }
    }
    this.setupCrud();
    this.refreshPanelSelect();
  }

  onUpdateState(property) {
    if (property === 'data' || property === 'panel-select') {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { this.refresh(); }, 100);
    }
  }

  getCrudPanels() {
    return (this.getField('data') || []).filter(p => p.Type === 'crud');
  }

  template() {
    const crudPanels = this.getCrudPanels();
    const selectedId = this.getField('panel-select');

    if (!crudPanels.length) {
      return `
      <div class="card mt-4">
        <div class="card-body">
          <p class="card-text text-muted">No CRUD panels defined. Go back to the Panels step and add at least one panel with type "CRUD Element".</p>
        </div>
      </div>
      <my-wizard-footer></my-wizard-footer>`;
    }

    return `
      <div class="card mt-4">
        <div class="card-header">CRUD Panel Field Definitions</div>
        <div class="card-body">
          <simpl-select id="panel-select" label="Select CRUD panel"></simpl-select>
          <simpl-crud name="data" context="cf-${selectedId || crudPanels[0].id}" actions="crud"></simpl-crud>
        </div>
      </div>
      <my-wizard-footer></my-wizard-footer>`;
  }

  setupCrud() {
    const crud = this.querySelector('simpl-crud');
    if (!crud) return;
    const types = [
      { id: 'input', text: 'Input' },
      { id: 'select', text: 'Select' },
      { id: 'textarea', text: 'Textarea' },
      { id: 'date', text: 'Date' },
    ];
    crud.setHeaders(['name', 'label', 'type', 'required', 'hidden']);
    crud.setForm([
      { name: 'name', required: true, class: 'col-12', unique: true, label: 'Field name' },
      { name: 'type', class: 'col-4', type: 'select', items: JSON.stringify(types) },
      { name: 'items', class: 'col-8', type: 'textarea', label: 'Items (JSON for select)', rows: 2 },
      { name: 'required', class: 'col-3', type: 'switch' },
      { name: 'unique', class: 'col-3', type: 'switch' },
      { name: 'index', class: 'col-3', type: 'switch' },
      { name: 'hidden', class: 'col-3', type: 'switch' },
      { name: 'disabled', class: 'col-3', type: 'switch' },
      { name: 'class', class: 'col-9', label: 'CSS class', placeholder: 'col-12' },
    ]);
  }

  refreshPanelSelect() {
    const panelSelect = this.get('panel-select');
    if (!panelSelect) return;
    const crudPanels = this.getCrudPanels();
    panelSelect.items = crudPanels.map(p => ({ id: p.id, text: p.Label }));
  }
}
customElements.define('my-wizard-crud-fields', MyWizardCrudFields);
