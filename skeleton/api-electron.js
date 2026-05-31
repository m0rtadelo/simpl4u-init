/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getLocale: () => ipcRenderer.invoke('get-locale'),
  saveSystem: (key, data) => ipcRenderer.invoke('saveSystem', key, data),
  loadSystem: (key) => ipcRenderer.invoke('loadSystem', key),
  writeFile: (filePath, fileContent, options) => ipcRenderer.invoke('writeFile', filePath, fileContent, options),
  mkdir: (dirPath, options) => ipcRenderer.invoke('mkdir', dirPath, options),
  ls: (dirPath) => ipcRenderer.invoke('ls', dirPath),
  cp: (source, destination, options) => ipcRenderer.invoke('cp', source, destination, options),
  rm: (targetPath, options) => ipcRenderer.invoke('rm', targetPath, options),
  rmdir: (dirPath, options) => ipcRenderer.invoke('rmdir', dirPath, options),
});
