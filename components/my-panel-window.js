import { StaticElement } from 'simpl4u/core/static-element.js';

export class MyPanelWindow extends StaticElement {
  template() {
    return `
      <div class="card">
        <div class="card-header">
          Window Default Settings
        </div>
        <div class="card-body">
           <div class="card-text row">
             <simpl-input class="col-4" id="winx" required label="Window Width"></simpl-input>
             <simpl-input class="col-4" id="winy" required label="Window Height"></simpl-input>
             <simpl-switch class="col-4" style="margin-top: 40px" id="fullscreen" label="Fullscreen"></simpl-switch>
           </div>
           <div class="card-text row mt-2">
             <simpl-switch class="col-12" id="save-window-state" label="Remember window state"></simpl-switch>
           </div>
        </div>
      </div>    
    `;
  }
}
customElements.define('my-panel-window', MyPanelWindow);
