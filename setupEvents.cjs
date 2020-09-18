const currentWindow = require('electron').remote.getCurrentWindow();
currentWindow.show();
currentWindow.webContents.openDevTools();
