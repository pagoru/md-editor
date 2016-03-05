'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = require('menu');
const dialog = require('dialog');
const fs = require('fs');
const ipcMain = require('electron').ipcMain;

let mainWindow;

const mainMenu = Menu.buildFromTemplate([{}, {
  label: 'File',
  submenu: [
  {
    label: 'New File',
    click: function() {
      mainWindow.webContents.send('new-file');
    }
  },
  {
    label: 'Open File',
    click: openFileHandler
  },
  {
    label: 'Save As',
    click: saveFileHandler
  },
  {
    type: 'separator'
  },
  {
    label: 'Quit',
    accelerator: 'Command+Q',
    click: function() {
      app.quit();
    }
  }]
}]);

function openFileHandler () {
  dialog.showOpenDialog({ filters: [{ name: 'markdown', extensions: ['md'] }]}, function (fileNames) {
    if (fileNames === undefined) return;
    var fileName = fileNames[0];
    fs.readFile(fileName, 'utf-8', function (err, data) {
      mainWindow.webContents.send('load-file', data);
    });
  });
}

function saveFileHandler() {
  mainWindow.webContents.send('get-editor-content');

  ipcMain.once('editor-content', function(event, arg) {
    let fileName = dialog.showSaveDialog();

    if (fileName !== undefined) {
      fs.writeFile(fileName, arg);
    }
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600, title: 'MdEditor'});
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
  mainWindow.maximize();

  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createMainWindow);

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
