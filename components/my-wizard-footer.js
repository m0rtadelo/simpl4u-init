import { StaticElement } from 'simpl4u/core/static-element.js';
import { RouterService } from 'simpl4u/services/router-service.js';
import { CreateAppService } from '../services/create-app.js';
import { ValidationService } from '../services/validation.service.js';

export class MyWizardFooter extends StaticElement {
  wizard = ['app', 'panels', 'crud', 'navbar', 'notyf', 'confirm'];
  template() {
    return `
      <div class="card fixed-bottom">
        <div class="card-header row">
        <div class="col-6">
        ${ this.hasPrevious() ? `
          <div class="d-grid gap-2 d-md-flex justify-content-md-start">
            <button class="btn btn-primary" type="button" (click)="previousStep">Previous Step</button>
          </div>`: '' }
        </div>
        <div class="col-6">
        ${ this.hasNext() ? `
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-primary" type="button" (click)="nextStep">Next Step</button>
          </div>` : `
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-primary" type="button" (click)="createApp">Create App</button>
          </div>` }
          </div>
        </div>
      </div>
    `;
  }

  hasPrevious() {
    const actualPanel = RouterService.view;
    return this.wizard.indexOf(actualPanel) > 0;
  }

  hasNext() {
    const actualPanel = RouterService.view;
    return this.wizard.indexOf(actualPanel) < this.wizard.length - 1;
  }

  async createApp() {
    const result = await ValidationService.validate(this.data, 'confirm');
    if (result) {
      CreateAppService.createApp(this.data);
    }
  }

  async nextStep() {
    const actualPanel = RouterService.view;
    const result = await ValidationService.validate(this.data, actualPanel);
    if (!result) {
      return;
    }
    const index = this.wizard.indexOf(actualPanel);
    if (index < this.wizard.length - 1) {
      RouterService.setView(this.wizard[index + 1]);
    }
  }

  previousStep() {
    const actualPanel = RouterService.view;
    const index = this.wizard.indexOf(actualPanel);
    if (index > 0) {
      RouterService.setView(this.wizard[index - 1]);
    }
  }
}
customElements.define('my-wizard-footer', MyWizardFooter);
