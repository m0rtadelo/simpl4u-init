import { StaticElement } from '../../simpl4u/core/static-element.js';
/** @typedef {import('../../simpl4u/components/simpl-navbar.js').NavbarDefinition} NavbarDefinition */

export class MyNavBar extends StaticElement {
  
  template() {
    return '<simpl-navbar id="navbar" name="Init"></simpl-navbar>';
  }

  onReady() {
    const navbar = this.get('navbar');
    if (!navbar) return;
    navbar.hideLang = true;
    navbar.hideTheme = false;
    /** @type {NavbarDefinition[]} */
    const items = [
      { id: 'init', name: 'Welcome' },
      { id: 'app', name: 'Application' },
      { id: 'panels', name: 'Panels' },
      { id: 'navbar', name: 'Navbar' },
      { id: 'notyf', name: 'Notyf' },
      { id: 'confirm', name: 'Confirm' },
    ];
    navbar.items = items;
  }
}
customElements.define('my-navbar', MyNavBar);
