'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = require('menu');
const dialog = require('dialog');
const fs = require('fs');
const ipcMain = require('electron').ipcMain;

let mainWindow;
let fileName;

const mainMenu = Menu.buildFromTemplate([{}, {
  label: 'File',
  submenu: [
  {
    label: 'New File',
    click: newFileHandler
  },
  {
    label: 'Open File',
    click: openFileHandler
  },
  {
    label: 'Save',
    click: saveFileHandler
  },
  {
    label: 'Save As',
    click: saveAsFileHandler
  },
  {
    type: 'separator'
  },
  {
    label: 'Quit',
    accelerator: 'Command+Q',
    click: quitProgramHandler
  }]
}]);

function newFileHandler() {
  mainWindow.webContents.send('new-file');
  disableSaveMenuPosition();
}

function openFileHandler () {
  dialog.showOpenDialog({ filters: [{ name: 'markdown', extensions: ['md'] }]}, function (fileNames) {
    if (fileNames === undefined) return;
    fileName = fileNames[0];
    fs.readFile(fileName, 'utf-8', function (err, data) {
      mainWindow.webContents.send('load-file', data);
      enableSaveMenuPosition();
    });
  });
}

function saveAsFileHandler() {
  mainWindow.webContents.send('get-editor-content');

  ipcMain.once('editor-content', function(event, arg) {
    fileName = dialog.showSaveDialog();

    if (fileName !== undefined) {
      fs.writeFile(fileName, arg);
      enableSaveMenuPosition();
    }
  });
}

function saveFileHandler() {
  mainWindow.webContents.send('get-editor-content');

  ipcMain.once('editor-content', function(event, arg) {
    fs.writeFile(fileName, arg);
  });
}

function quitProgramHandler() {
  app.quit();
}

function disableSaveMenuPosition() {
  mainMenu.items[1].submenu.items[2].enabled = false;
}

function enableSaveMenuPosition() {
  mainMenu.items[1].submenu.items[2].enabled = true;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600, title: 'MdEditor'});
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
  mainWindow.maximize();

  disableSaveMenuPosition();
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
