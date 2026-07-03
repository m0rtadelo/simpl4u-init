import { StaticElement } from 'simpl4u/core/static-element.js';
import { NavbarService } from 'simpl4u/services/navbar-service.js';

export class MyNavBar extends StaticElement {

  template() {
    return '<simpl-navbar id="navbar" name="Init"></simpl-navbar>';
  }

  connectedCallback() {
    super.connectedCallback();
    NavbarService.items = [
      { id: 'init', name: 'Welcome' },
      { id: 'app', name: 'Application' },
      { id: 'panels', name: 'Panels' },
      { id: 'crud', name: 'CRUD Fields' },
      { id: 'navbar', name: 'Navbar' },
      { id: 'notyf', name: 'Notyf' },
      { id: 'confirm', name: 'Confirm' },
    ];
  }

  onReady() {
    const navbar = this.get('navbar');
    if (!navbar) return;
    navbar.hideLang = true;
    navbar.hideTheme = false;
  }
}
customElements.define('my-navbar', MyNavBar);
