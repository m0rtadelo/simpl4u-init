/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const pkg = require('./package.json');
const appName = `${pkg.name} (${pkg.version})`;
let win;

// Set app name and userData path from package.json BEFORE any storage access
const userDataPath = path.join(app.getPath('appData'), pkg.name);
app.setName(pkg.name);
app.setPath('userData', userDataPath);
console.log(`User data path set to: ${userDataPath}`);

ipcMain.on('get-app-name', (e) => {
  e.returnValue = pkg.name;
});

ipcMain.on('get-app-version', (e) => {
  win.title = appName;
  e.returnValue = pkg.version;
});

ipcMain.handle('get-locale', () => {
  return app.getLocale(); // e.g., "en-US"
});

ipcMain.handle('selectDirectory', async (event, options = {}) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    const result = await dialog.showOpenDialog(win, {
      title: options.title || 'Select destination folder',
      properties: ['openDirectory', 'createDirectory'],
      ...options,
    });
    return result.canceled ? null : result.filePaths[0];
  } catch (error) {
    console.error(error);
    return null;
  }
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

ipcMain.handle('exec', (event, command, options = {}) => {
  try {
    const stdout = execSync(command, { cwd: options.cwd, timeout: options.timeout || 120000, encoding: 'utf-8' });
    return { stdout: stdout || '', stderr: '' };
  } catch (error) {
    console.error(error);
    return { error: error.message, stdout: error.stdout?.toString() || '', stderr: error.stderr?.toString() || '' };
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    title: appName,
    webPreferences: {
      preload: path.join(__dirname, 'api-electron.js'),
    }
  });

  win.loadFile('index.html');
  win.autoHideMenuBar = true;
  win.setMenuBarVisibility(false);
  console.log(app.getPath('userData'));
  //win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
