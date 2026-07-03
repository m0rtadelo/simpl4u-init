import { ToastService } from 'simpl4u/services/toast-service.js';
import { StaticElement } from 'simpl4u/core/static-element.js';
import { LanguageService } from 'simpl4u/services/language-service.js';
import { RouterService } from 'simpl4u/services/router-service.js';
import { StorageService } from 'simpl4u/services/storage-service.js';
%lang_imports

export class MyApp extends StaticElement {

  constructor() {
    super();
    this.initApp();
  }

  initApp() {
    // Set storage key and title from app name FIRST, before any storage access
    const appName = globalThis.api?.appName ?? 'init';
    const appVersion = globalThis.api?.appVersion ?? '0.0.1';
    StorageService.key = appName;
    document.title = appName + ' (' + appVersion + ')';    
    LanguageService.set({ %lang_ids }%default_lang);
    ToastService.duration = %duration;
    ToastService.dismissible = %dismissible;
    ToastService.position = { x: '%positionx', y: '%positiony' };
    %router_init
  }

  template() {
    const v = RouterService.view;
    return `
    %navbar
    <div class="container-fluid">
      <div class="row">
%app_items      </div>
    </div>
    <simpl-spinner></simpl-spinner>
        `;
  }
}
customElements.define('my-app', MyApp);
