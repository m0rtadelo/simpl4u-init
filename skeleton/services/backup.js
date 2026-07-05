import { FileService } from 'simpl4u/services/file-service.js';
import { StorageService } from 'simpl4u/services/storage-service.js';
import { SimplModel } from 'simpl4u/models/simpl-model.js';

export class BackupService {
  static async export() {
    const data = await StorageService.loadAppModel();
    FileService.download('export.json', data);
  }

  static async import(file) {
    const content = await file.text();
    const json = JSON.parse(content);
    await StorageService.saveAppModel(json);
    StorageService.saveUserModel(json);
    SimplModel.model = json;
  }
}
