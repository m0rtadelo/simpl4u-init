import { ReactiveElement } from '../../simpl4u/core/reactive-element.js';

export class MySimplSwitch extends ReactiveElement {
  template(state) {
    const disabled = state.lang?.length < 2;
    return `<simpl-switch ${disabled ? 'disabled' : ''} id="language-selector" label="Show language selector on the NavBar (enabled if multiple languages)"></simpl-switch>`;
  }
}
customElements.define('my-simpl-switch', MySimplSwitch);
