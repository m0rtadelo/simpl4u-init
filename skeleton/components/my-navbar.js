import { StaticElement } from 'simpl4u/core/static-element.js';
import { NavbarService } from 'simpl4u/services/navbar-service.js';

export class MyNavBar extends StaticElement {

  template() {
    return '<simpl-navbar id="navbar" name="%title"></simpl-navbar>';
  }

  connectedCallback() {
    super.connectedCallback();
    NavbarService.items = [
      %navbar_items
    ];
  }

  onReady() {
    const navbar = this.get('navbar');
    if (!navbar) return;
    navbar.hideLang = %language-selector;
    navbar.hideTheme = %theme-selector;
    navbar.languages = [
      %languages
    ];
  }
}
customElements.define('my-navbar', MyNavBar);
