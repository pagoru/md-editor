'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const fs = require('fs');

let mainWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({ show: false, width: 1280, height: 720, title: 'MdEditor',
                                   webPreferences: { nodeIntegration: true }, icon: __dirname + '/app/images/icon.png' });
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  Menu.setApplicationMenu(null);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', function() {
      mainWindow.show();
  });
};

const initializeApp = () => {
  createMainWindow();
};

app.on('ready', initializeApp);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow();
  }
});
