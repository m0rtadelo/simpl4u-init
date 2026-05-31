import { StaticElement } from '../../simpl4u/core/static-element.js';

export class MyPanelLanguages extends StaticElement {
  template() {
    return `
      <div class="card" style="margin-top: 20px">
        <div class="card-header">
          Available Languages
        </div>
        <div class="card-body">
          <div class="card-text row">
            <simpl-checkboxes class="col-12" id="lang" values="English,Español,Català,Deutsch,日本語"></simpl-checkboxes>
          </div>
        </div>
      </div>    
    `;
  }
}
customElements.define('my-panel-languages', MyPanelLanguages);
