const { app, BrowserWindow, Tray, Menu, globalShortcut, nativeImage } = require('electron');
const path = require("path")
import { format as formatUrl } from 'url'
var tray;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const isDevelopment = process.env.NODE_ENV !== 'production'


let firstBlur = true;
 
/** require('update-electron-app')({
  repo: 'asilluron/gif-cake',
  updateInterval: '1 hour',
  logger: require('electron-log')
})

*/


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 300,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });


  //global.token = tokenNative.token();


  globalShortcut.register('CommandOrControl+Alt+G', () => {
    mainWindow.show();
  })

  
  mainWindow.on('blur', () => {
    globalShortcut.unregister('Esc')
    if(firstBlur) {
      firstBlur = false;
    } else {
      mainWindow.hide();
    }
  });

  mainWindow.on('focus', () => {
    globalShortcut.register('Esc', () => {
      mainWindow.hide();
    })
  });

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    mainWindow.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }


  let trayPath = '';
  if(isDevelopment) {
    trayPath = path.join(path.dirname(__dirname), 'assets','tray.png');
    tray = new Tray(trayPath);
  } else {

      trayPath = path.join(path.dirname(__dirname), 'extraResources','tray.png');
  }

  tray = new Tray(trayPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', type: 'normal', role: 'quit' }
  ])


  tray.setToolTip('Gif Cake')
  tray.setContextMenu(contextMenu)
  
  app.dock.hide()


  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
