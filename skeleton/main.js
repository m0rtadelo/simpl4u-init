/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

ipcMain.handle('get-locale', () => {
  return app.getLocale(); // e.g., "en-US"
});

ipcMain.handle('saveSystem', (event, key, data) => {
  const userProfilePath = app.getPath('userData');
  const filePath = path.join(userProfilePath, key);
  const fileContent = data;

  // Write the file
  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Failed to save the file:', err);
    } else {
      console.log('File saved successfully at:', filePath);
    }
  });
});

ipcMain.handle('loadSystem', (event, key) => {
  const userProfilePath = app.getPath('userData');
  const filePath = path.join(userProfilePath, key);
  return fs.readFileSync(filePath, 'utf8');
});

ipcMain.handle('writeFile', (event, filePath, fileContent, options) => {
  try {
    fs.writeFileSync(filePath, fileContent, options);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('readFile', (event, filePath, encoding = 'utf8') => {
  try {
    return fs.readFileSync(filePath, encoding);
  } catch (error) {
    console.error(error);
    return null;
  }
});

ipcMain.handle('mkdir', (event, dirPath, options = { recursive: true }) => {
  try {
    fs.mkdirSync(dirPath, options);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('ls', (event, dirPath) => {
  try {
    return fs.readdirSync(dirPath);
  } catch (error) {
    console.error(error);
    return null;
  }
});

function copyRecursiveSync(source, destination, options = { force: true }) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    for (const entry of fs.readdirSync(source)) {
      const srcPath = path.join(source, entry);
      const destPath = path.join(destination, entry);
      copyRecursiveSync(srcPath, destPath, options);
    }
  } else {
    if (fs.existsSync(destination) && !options.force) {
      return;
    }
    fs.copyFileSync(source, destination);
  }
}

ipcMain.handle('cp', (event, source, destination, options = { recursive: true, force: true }) => {
  try {
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(source, destination, options);
    } else {
      copyRecursiveSync(source, destination, options);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('rm', (event, targetPath, options = { force: true, recursive: true }) => {
  try {
    if (typeof fs.rmSync === 'function') {
      fs.rmSync(targetPath, options);
    } else {
      fs.unlinkSync(targetPath);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('rmdir', (event, dirPath, options = { recursive: false }) => {
  try {
    if (typeof fs.rmSync === 'function') {
      fs.rmSync(dirPath, { ...options, force: false });
    } else {
      fs.rmdirSync(dirPath, options);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: %winx,
    height: %winy,
    fullscreen: %fullscreen,
    webPreferences: {
      preload: path.join(__dirname, 'api-electron.js'),
    }
  });

  win.loadFile('index.html');
  win.autoHideMenuBar = true;
  win.setMenuBarVisibility(false);
  console.log(app.getPath('userData'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
