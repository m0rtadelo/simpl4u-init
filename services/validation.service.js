import { ModalService } from '../../simpl4u/services/modal-service.js';
import { RouterService } from '../../simpl4u/services/router-service.js';

export class ValidationService {
  static async validate(model, panel) {
    if (panel === 'app' || panel === 'confirm') {
      if (!model.name) {
        await ModalService.message('Please enter your app name', 'Error');
        this.focus('app', 'name');
        return false;
      }
      if (!model.winx || isNaN(model.winx)) {
        await ModalService.message('Window Width is a numeric required value', 'Error');
        this.focus('app', 'winx');
        return false;
      }
      if (!model.winy || isNaN(model.winy)) {
        await ModalService.message('Window Height is a numeric required value', 'Error');
        this.focus('app', 'winy');
        return false;
      }
    }
    if (panel === 'navbar' || panel === 'confirm') {
      if (!model.title) {
        await ModalService.message('Please enter your app title', 'Error');
        this.focus('navbar', 'title');
        return false;
      }
    }
    if (panel === 'notyf' || panel === 'confirm') {
      if (!model.duration || isNaN(model.duration)) {
        await ModalService.message('Notification Duration is a numeric required value', 'Error');
        this.focus('notyf', 'duration');
        return false;
      }
    }
    if (panel === 'confirm') {
      if (!model.root) {
        await ModalService.message('Please select the folder on which to create your app', 'Error');
        this.focus('confirm');
        return false;
      }
    }
    if (panel === 'confirm') {
      if (!model.data?.length) {
        return await ModalService.confirm('No panels have been added to your app. Do you want to continue?', 'Warning');
      }
    }
    return true;
  }

  static focus(panel, field){
    RouterService.setView(panel);
    if (field) {
      setTimeout(() => {
        document.getElementById(field)?.focus();
      }, 100);
    }
  }
}
