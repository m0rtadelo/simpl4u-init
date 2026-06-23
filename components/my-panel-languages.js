import { StaticElement } from '../../simpl4u/core/static-element.js';
import { ModalService } from '../../simpl4u/services/modal-service.js';

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

  onReady() {
    const checkboxes = this.get('lang');
    if (!checkboxes) return;
    const original = checkboxes.toggleCheckbox.bind(checkboxes);
    checkboxes.toggleCheckbox = (event) => {
      const values = this.data.lang || [];
      if (!event.target.checked && values.length <= 1) {
        ModalService.message('At least one language should be selected', 'Warning');
        event.target.checked = true;
        return;
      }
      original(event);
    };
  }
}
customElements.define('my-panel-languages', MyPanelLanguages);
