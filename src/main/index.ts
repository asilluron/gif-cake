import { app, BrowserWindow, Tray, Menu, globalShortcut, nativeImage } from 'electron';
import path from 'node:path';

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;
let firstBlur = true;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (process.platform === 'win32') {
  app.quit();
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 300,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  globalShortcut.register('CommandOrControl+Alt+G', () => {
    mainWindow?.show();
  });

  mainWindow.on('blur', () => {
    globalShortcut.unregister('Esc');
    if (firstBlur) {
      firstBlur = false;
    } else {
      mainWindow?.hide();
    }
  });

  mainWindow.on('focus', () => {
    globalShortcut.register('Esc', () => {
      mainWindow?.hide();
    });
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Set up tray icon
  const trayPath = app.isPackaged
    ? path.join(process.resourcesPath, 'extraResources', 'tray.png')
    : path.join(app.getAppPath(), 'extraResources', 'tray.png');

  const trayIcon = nativeImage.createFromPath(trayPath);
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', type: 'normal', role: 'quit' },
  ]);

  tray.setToolTip('Gif Cake');
  tray.setContextMenu(contextMenu);

  if (app.dock) {
    app.dock.hide();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

