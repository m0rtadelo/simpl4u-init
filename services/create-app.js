import { FileService } from '../../simpl4u/services/file-service.js';
import { ModalService } from '../../simpl4u/services/modal-service.js';
import { SpinnerService } from '../../simpl4u/services/spinner-service.js';
import { StorageService } from '../../simpl4u/services/storage-service.js';
import { PlaceholderService } from './placeholder-service.js';
import { ComponentBuilder } from './component-builder.js';

export class CreateAppService {
  static async createApp(model) {
    try {
      await this.checkPrerequisites();
      const root = `${model.root}/${model.name}`;
      console.log(model);

      for (const panel of model.data || []) {
        if (panel.Type === 'crud') {
          const fieldsData = await StorageService.loadApp('cf-' + panel.id);
          if (fieldsData?.data?.length) {
            panel._fields = fieldsData.data;
          }
        }
      }

      SpinnerService.show();
      await this.copySkeletonStructure(root, model);
      await PlaceholderService.setWindow(root, model);
      await PlaceholderService.setAppName(root, model);
      await PlaceholderService.setRouter(root, model);
      await PlaceholderService.setNavBar(root, model);
      await PlaceholderService.setLanguages(root, model);
      await PlaceholderService.setNotyf(root, model);
      await this.setPanels(root, model);
      await this.postGenerationSteps(root);
      SpinnerService.hide();
      ModalService.message(`App ${model.name} created at ${root}`, 'Success');
    } catch (error) {
      SpinnerService.hide();
      console.error(error);
      ModalService.message(`Error creating app: ${error.message}`, 'Error');
    }
  }

  static async checkPrerequisites() {
    const checks = [
      { cmd: 'node --version', name: 'Node.js' },
      { cmd: 'npm --version', name: 'npm' },
      { cmd: 'git --version', name: 'Git' },
    ];
    const missing = [];
    for (const { cmd, name } of checks) {
      const result = await window.api.exec(cmd);
      if (result.error) missing.push(name);
    }
    if (missing.length) {
      throw new Error(`Missing prerequisites: ${missing.join(', ')}. Please install them and try again.`);
    }
  }

  static async copySkeletonStructure(root, model) {
    await FileService.mkdir(root);
    await FileService.cp('./skeleton', root, { recursive: true });
    const simpl4uTarget = `${model.root}/simpl4u`;
    const exists = await FileService.ls(simpl4uTarget);
    if (exists) {
      SpinnerService.hide();
      const result = await ModalService.confirm(
        'A simpl4u folder already exists in the target directory. Do you want to overwrite it?',
        'Warning'
      );
      if (result) {
        await FileService.rm(simpl4uTarget, { recursive: true, force: true });
        const cloneResult = await window.api.exec('git clone https://github.com/m0rtadelo/simpl4u simpl4u', { cwd: model.root, timeout: 120000 });
        if (cloneResult.error) throw new Error(`Failed to clone simpl4u: ${cloneResult.stderr}`);
      }
    } else {
      const cloneResult = await window.api.exec('git clone https://github.com/m0rtadelo/simpl4u simpl4u', { cwd: model.root, timeout: 120000 });
      if (cloneResult.error) throw new Error(`Failed to clone simpl4u: ${cloneResult.stderr}`);
    }
    SpinnerService.show();
  }

  static async setPanels(root, model) {
    if (!model.data?.length) {
      await PlaceholderService.replaceHolders(root, '/components/my-app.js', 'app_items', ' ');
      await PlaceholderService.replaceHolders(root, '/components/my-navbar.js', 'navbar_items', ' ');
      return;
    }

    let appItems = '';
    let navbarItems = '';
    const allImports = [];

    for (const panel of model.data) {
      appItems += `        \${ v === '${panel.id}' ? '<my-${panel.id}></my-${panel.id}>' : '' }\n`;
      if (!panel['Hidden in Navbar']) {
        navbarItems += `{ id: '${panel.id}', name: '${panel.Label}' }, `;
      }
      const imports = await ComponentBuilder.createComponent(root, panel);
      allImports.push(...imports);
    }

    if (model['import-export']) {
      appItems += '${ v === \'settings\' ? \'<my-settings></my-settings>\' : \'\' }\n';
      navbarItems += '{ id: \'settings\', name: \'Settings\' }, ';
      const imports = await ComponentBuilder.createImportExportComponent(root);
      allImports.push(...imports);
    }

    await PlaceholderService.replaceHolders(root, '/components/my-app.js', 'app_items', appItems);
    await PlaceholderService.replaceHolders(root, '/components/my-navbar.js', 'navbar_items', navbarItems);

    let indexContent = await FileService.readFile(`${root}/index.js`, 'utf-8');
    indexContent += '\n' + allImports.join('\n');
    await FileService.writeFileSync(`${root}/index.js`, indexContent, { encoding: 'utf-8' });
  }

  static async postGenerationSteps(root) {
    const npmResult = await window.api.exec('npm install', { cwd: root, timeout: 120000 });
    if (npmResult.error) {
      console.error('npm install failed:', npmResult.stderr);
    }
    const gitInitResult = await window.api.exec('git init', { cwd: root, timeout: 30000 });
    if (gitInitResult.error) {
      console.error('git init failed:', gitInitResult.stderr);
      return;
    }
    const gitAddResult = await window.api.exec('git add .', { cwd: root, timeout: 30000 });
    if (gitAddResult.error) {
      console.error('git add failed:', gitAddResult.stderr);
      return;
    }
    const gitCommitResult = await window.api.exec('git commit -m "Initial commit"', { cwd: root, timeout: 30000 });
    if (gitCommitResult.error) {
      console.error('git commit failed:', gitCommitResult.stderr);
    }
  }
}
