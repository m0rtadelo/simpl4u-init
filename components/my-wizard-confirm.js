import { StaticElement } from '../../simpl4u/core/static-element.js';
import { FileService } from '../../simpl4u/services/file-service.js';
import { CreateAppService } from '../services/create-app.js';

export class MyWizardConfirm extends StaticElement {
  
  template() {
    return `
    <div class="row" style="margin-top: 20px">
        <simpl-input id="root" class="col-md-10 col-9" label="App destination folder" disabled></simpl-input>
        <simpl-button class="col-3 col-md-2" style="margin-top: 32px;" (click)="selectRootFolder">Browse</simpl-button>
    </div>
    <my-wizard-footer></my-wizard-footer>
    `;
  }
  async selectRootFolder() {
    const selected = await FileService.selectDirectory({
      title: 'Select the folder where the app should be created',
    });
    if (!selected) {
      return;
    }
    CreateAppService.root = selected.concat('/' + this.model.name);
    this.setField('root', selected);
  }

}
customElements.define('my-wizard-confirm', MyWizardConfirm);
