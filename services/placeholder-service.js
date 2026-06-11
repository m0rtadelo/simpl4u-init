import { FileService } from '../../simpl4u/services/file-service.js';

export class PlaceholderService {
  static async setWindow(root, model) {
    await this.replaceHolders(root, '/main.js', 'winx', model.winx);
    await this.replaceHolders(root, '/main.js', 'winy', model.winy);
    await this.replaceHolders(root, '/main.js', 'fullscreen', model.fullscreen ? 'true' : 'false');
    await this.replaceHolders(root, '/main.js', 'save-window-state', model['save-window-state'] ? 'true' : 'false');
  }

  static async setAppName(root, model) {
    await this.replaceHolders(root, '/README.md', 'name', model.name);
    await this.replaceHolders(root, '/package.json', 'name', model.name);
    await this.replaceHolders(root, '/index.html', 'name', model.name);
    await this.replaceHolders(root, '/components/my-app.js', 'name', model.name);
    await this.replaceHolders(root, '/main.js', 'name', model.name);
  }

  static async setRouter(root, model) {
    if (model.data?.length) {
      await this.replaceHolders(root, '/components/my-app.js', 'router_init',
        `RouterService.view = '${model.data[0].id}'; // Set initial view`);
    } else {
      await this.replaceHolders(root, '/components/my-app.js', 'router_init',
        '// RouterService.view = \'\'; // Set initial view');
    }
  }

  static async setNavBar(root, model) {
    if (model.navbar) {
      await this.replaceHolders(root, '/components/my-app.js', 'navbar', '<my-navbar></my-navbar>');
      await this.replaceHolders(root, '/components/my-navbar.js', 'title', model.title);
      await this.replaceHolders(root, '/components/my-navbar.js', 'language-selector',
        (!model['language-selector'] || model.lang?.length < 2) ? 'true' : 'false');
      await this.replaceHolders(root, '/components/my-navbar.js', 'theme-selector',
        model['theme-selector'] ? 'false' : 'true');
    } else {
      await this.replaceHolders(root, '/components/my-app.js', 'navbar', ' ');
      await FileService.rm(`${root}/components/my-navbar.js`, { force: true });
      let indexContent = await FileService.readFile(`${root}/index.js`, 'utf-8');
      indexContent = indexContent.replace(/import.*MyNavBar.*;\n?/, '');
      await FileService.writeFileSync(`${root}/index.js`, indexContent, { encoding: 'utf-8' });
    }
  }

  static async setNotyf(root, model) {
    await this.replaceHolders(root, '/components/my-app.js', 'duration', model.duration);
    await this.replaceHolders(root, '/components/my-app.js', 'dismissible', model.dismissible);
    await this.replaceHolders(root, '/components/my-app.js', 'positionx', model.positionx);
    await this.replaceHolders(root, '/components/my-app.js', 'positiony', model.positiony);
  }

  static async setLanguages(root, model) {
    const map = {
      'English': { id: 'en', name: 'English', import: 'import { words as en } from \'../assets/i18n/en.js\';' },
      'Español': { id: 'es', name: 'Español', import: 'import { words as es } from \'../assets/i18n/es.js\';' },
      'Català': { id: 'ca', name: 'Català', import: 'import { words as ca } from \'../assets/i18n/ca.js\';' },
      'Deutsch': { id: 'de', name: 'Deutsch', import: 'import { words as de } from \'../assets/i18n/de.js\';' },
      '日本語': { id: 'ja', name: '日本語', import: 'import { words as ja } from \'../assets/i18n/ja.js\';' },
    };

    const translations = {
      en: {
        'filter-text': 'Filter...',
        'export-data-to-file': 'Export data to file',
        'export-data': 'Export data',
        'restore-data-from-backup-file': 'Restore data from backup file',
        'restore-data': 'Restore data',
        'no-file-selected': 'No file selected',
        'error-importing-data': 'Error importing data',
      },
      es: {
        'filter-text': 'Filtrar...',
        'export-data-to-file': 'Exportar datos a archivo',
        'export-data': 'Exportar datos',
        'restore-data-from-backup-file': 'Restaurar datos desde archivo de respaldo',
        'restore-data': 'Restaurar datos',
        'no-file-selected': 'Ningún archivo seleccionado',
        'error-importing-data': 'Error al importar datos',
      },
      ca: {
        'filter-text': 'Filtrar...',
        'export-data-to-file': 'Exportar dades a fitxer',
        'export-data': 'Exportar dades',
        'restore-data-from-backup-file': 'Restaurar dades des de fitxer de còpia de seguretat',
        'restore-data': 'Restaurar dades',
        'no-file-selected': 'Cap fitxer seleccionat',
        'error-importing-data': 'Error en importar dades',
      },
      de: {
        'filter-text': 'Filtern...',
        'export-data-to-file': 'Daten in Datei exportieren',
        'export-data': 'Daten exportieren',
        'restore-data-from-backup-file': 'Daten aus Sicherungsdatei wiederherstellen',
        'restore-data': 'Daten wiederherstellen',
        'no-file-selected': 'Keine Datei ausgewählt',
        'error-importing-data': 'Fehler beim Importieren der Daten',
      },
      ja: {
        'filter-text': 'フィルター',
        'export-data-to-file': 'データをファイルにエクスポート',
        'export-data': 'データをエクスポート',
        'restore-data-from-backup-file': 'バックアップファイルからデータを復元',
        'restore-data': 'データを復元',
        'no-file-selected': 'ファイルが選択されていません',
        'error-importing-data': 'データのインポート中にエラーが発生しました',
      },
    };

    const custom = [];
    for (const lang of model.lang) {
      const entry = map[lang];
      if (!entry) continue;
      custom.push(entry);
      const langTranslations = translations[entry.id] || translations.en;
      const words = { title: model.title, ...langTranslations };
      await FileService.writeFileSync(
        `${root}/assets/i18n/${entry.id}.js`,
        `export const words = ${JSON.stringify(words, null, 2)};`,
        { encoding: 'utf-8' }
      );
    }

    const ids = custom.map(c => c.id).join(', ');
    const imports = custom.map(c => c.import).join('\n');
    const languages = custom.map(c => `{ id: '${c.id}', name: '${c.name}' }`).join(',\n');

    await this.replaceHolders(root, '/components/my-app.js', 'lang_imports', imports);
    await this.replaceHolders(root, '/components/my-app.js', 'lang_ids', ids);
    await this.replaceHolders(root, '/components/my-navbar.js', 'languages', languages);
    if (custom.length === 1) {
      await this.replaceHolders(root, '/components/my-app.js', 'default_lang', `, '${custom[0].id}'`);
    } else {
      await this.replaceHolders(root, '/components/my-app.js', 'default_lang', '');
    }
  }

  static async replaceHolders(root, file, holder, value) {
    const path = root + file;
    const content = await FileService.readFile(path, 'utf-8');
    if (content === null) {
      console.error(`File not found: ${path}`);
      return;
    }
    const newContent = content.replaceAll(`%${holder}`, value !== undefined ? value : '');
    await FileService.writeFileSync(path, newContent, { encoding: 'utf-8' });
  }
}
