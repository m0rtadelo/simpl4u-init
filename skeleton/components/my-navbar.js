import { StaticElement } from '../../simpl4u/core/static-element.js';
/** @typedef {import('../../simpl4u/components/simpl-navbar.js').NavbarDefinition} NavbarDefinition */

export class MyNavBar extends StaticElement {
  
  template() {
    return '<simpl-navbar id="navbar" name="%title"></simpl-navbar>';
  }

  onReady() {
    const navbar = this.get('navbar');
    if (!navbar) return;
    navbar.hideLang = %language-selector;
    navbar.hideTheme = %theme-selector;
    navbar.languages = [ 
      %languages
    ]; // Set available languages in the navbar
    /** @type {NavbarDefinition[]} */
    const items = [
      %navbar_items
    ];
    navbar.items = items;
  }
}
customElements.define('my-navbar', MyNavBar);
