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

const SAVE_WINDOW_STATE = %save-window-state;

function getWindowStatePath() {
  return path.join(app.getPath('userData'), `window-state-%name.json`);
}

function loadWindowState() {
  try {
    const data = fs.readFileSync(getWindowStatePath(), 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveWindowState(win) {
  try {
    const bounds = win.getBounds();
    const state = {
      width: bounds.width,
      height: bounds.height,
      fullscreen: win.isFullScreen(),
    };
    fs.writeFileSync(getWindowStatePath(), JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('Failed to save window state:', err);
  }
}

function createWindow() {
  const defaults = { width: %winx, height: %winy, fullscreen: %fullscreen };
  const state = SAVE_WINDOW_STATE ? { ...defaults, ...loadWindowState() } : defaults;

  const win = new BrowserWindow({
    width: state.width,
    height: state.height,
    fullscreen: state.fullscreen,
    webPreferences: {
      preload: path.join(__dirname, 'api-electron.js'),
    }
  });

  if (SAVE_WINDOW_STATE) {
    let saveTimeout;
    win.on('resize', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => saveWindowState(win), 500);
    });
    win.on('enter-full-screen', () => saveWindowState(win));
    win.on('leave-full-screen', () => saveWindowState(win));
    win.on('close', () => saveWindowState(win));
  }

  win.loadFile('index.html');
  win.autoHideMenuBar = true;
  win.setMenuBarVisibility(false);
  console.log(app.getPath('userData'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
