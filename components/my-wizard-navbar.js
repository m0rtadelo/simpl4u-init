import { StaticElement } from 'simpl4u/core/static-element.js';

export class MyWizardNavBar extends StaticElement {
  timer = undefined;

  template(state) {
    const template = 
`
    <div style="margin-top: 20px"></div>
    <simpl-switch id="navbar" class="col-12" label="Show the NavBar on the top of the window app"></simpl-switch>
    ${state.navbar ? `
      <div class="card" style="margin-top: 20px" id="navbar-settings">
        <div class="card-header">
          NavBar settings
        </div>
        <div class="card-body">
          <div class="card-text row">
            <simpl-input required class="col-12" id="title" label="NavBar title" placeholder="Enter your title"></simpl-input>
            <simpl-input class="col-12" id="navbar-icon" label="NavBar icon (Bootstrap Icons class)" placeholder="e.g. bi-rocket"></simpl-input>
            <div class="row" style="margin-top: 20px">
              <simpl-switch class="col-12" id="theme-selector" label="Show theme selector on the NavBar"></simpl-switch>
            </div>
            ${state.lang?.length < 2 ? '' : '<simpl-switch class="col-12" id="language-selector" label="Show language selector"></simpl-switch>'}
            <div class="row" style="margin-top: 20px">
              <simpl-select class="col-12" id="navbar-theme" label="NavBar theme" items='[{"id": "body-tertiary", "text": "Default"},{"id": "primary", "text": "Primary"},{"id": "secondary", "text": "Secondary"},{"id": "success", "text": "Success"},{"id": "danger", "text": "Danger"},{"id": "warning", "text": "Warning"},{"id": "info", "text": "Info"},{"id": "dark", "text": "Dark"},{"id": "light", "text": "Light"}]'></simpl-select>
            </div>
          </div>
        </div>
      </div>
      ` : ''} 
    <my-wizard-footer></my-wizard-footer>
    `;    
    return template;
  }


  onUpdateState(property) {
    if (property === 'navbar') {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.refresh();
      }, 100);
    }
  }
}
customElements.define('my-wizard-navbar', MyWizardNavBar);
