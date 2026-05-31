import { StaticElement } from '../../simpl4u/core/static-element.js';
import { RouterService } from '../../simpl4u/services/router-service.js';

export class MyInit extends StaticElement {
  template() {
    return `
<div class="card" style="margin-top: 20px;">
  <div class="card-header">
    Welcome to the Init App Wizard
  </div>
  <div class="card-body">
    <p class="card-text">
      This is a helper to start creating your app with Simpl4u. Press the buton below to start the wizard that will guide you through the process of creating your first app.
    </p>
    <p class="card-text">
      The project will work as an Electron app or as an SPA in the browser. You can publish it as a static website or as a desktop app. The choice is yours!
    </p>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button class="btn btn-primary" type="button" (click)="startWizard">Help me start creating my awesome App</button>
    </div>
  </div>
</div>    
        `;
  }

  startWizard() {
    RouterService.setView('app');
  }
}
customElements.define('my-init', MyInit);
