/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  appName: ipcRenderer.sendSync('get-app-name'),
  appVersion: ipcRenderer.sendSync('get-app-version'),
  getLocale: () => ipcRenderer.invoke('get-locale'),
  saveSystem: (key, data) => ipcRenderer.invoke('saveSystem', key, data),
  loadSystem: (key) => ipcRenderer.invoke('loadSystem', key),
  writeFile: (filePath, fileContent, options) => ipcRenderer.invoke('writeFile', filePath, fileContent, options),
  readFile: (filePath, encoding) => ipcRenderer.invoke('readFile', filePath, encoding),
  mkdir: (dirPath, options) => ipcRenderer.invoke('mkdir', dirPath, options),
  ls: (dirPath) => ipcRenderer.invoke('ls', dirPath),
  cp: (source, destination, options) => ipcRenderer.invoke('cp', source, destination, options),
  rm: (targetPath, options) => ipcRenderer.invoke('rm', targetPath, options),
  rmdir: (dirPath, options) => ipcRenderer.invoke('rmdir', dirPath, options),
  selectDirectory: (options) => ipcRenderer.invoke('selectDirectory', options),
  exec: (command, options) => ipcRenderer.invoke('exec', command, options),
});
