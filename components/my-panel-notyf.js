import { StaticElement } from '../../simpl4u/core/static-element.js';

export class MyPanelNotyf extends StaticElement {
  template() {
    return `
      <div class="card">
        <div class="card-header">
          Notyf Settings
        </div>
        <div class="card-body">
        <p class="card-text">
          Set the default settings for the Notyf notifications. These settings will be applied to all notifications shown in the app.
        </p>
          <div class="card-text row">
             <simpl-input required class="col-3" id="duration" label="Duration (ms)"></simpl-input>
             <simpl-select required class="col-3" id="positionx" label="Position X" items='[{"id": "left", "text": "Left"},{"id": "center", "text": "Center"},{"id": "right", "text": "Right"}]'></simpl-select>
             <simpl-select required class="col-3" id="positiony" label="Position Y" items='[{"id": "top", "text": "Top"},{"id": "center", "text": "Center"},{"id": "bottom", "text": "Bottom"}]'></simpl-select>
             <simpl-switch class="col-3" style="margin-top: 40px" id="dismissible" label="Dismissible"></simpl-switch>
           </div>
        </div>
      </div>    
    `;
  }
}
customElements.define('my-panel-notyf', MyPanelNotyf);
