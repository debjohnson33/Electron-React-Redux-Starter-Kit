const Datastore = require('nedb');
const electron = require('electron');
const isDev = require('electron-is-dev');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let db_blades;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 780,
        webPreferences: { backgroundThrottling: true }
    });
    mainWindow.loadURL(`file://${__dirname}/build/index.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

// Database (NeDB)
var userData = app.getPath('userData');

db_blades = new Datastore({ filename: userData +'/db/blades.db', timestampData: true });
db_blades.loadDatabase();

ipcMain.on('addBlade', (event, blade) => {
    db_blades.insert(blade, function (err, newBlade) {
        if (!err) {
            db_blades.find({}).sort({ updatedAt: -1 }).exec(function (err, blades) {                
                if (!err) {
                    mainWindow.webContents.send('blade:added', blades, newBlade);
                }
            });
        }
    });
});

ipcMain.on('fetchBlades', (event) => {

    db_blades.find({}).sort({ updatedAt: -1 }).exec(function (err, blades) {
        if (!err) {
            mainWindow.webContents.send('fetched:blades', blades);
        }
    });
});

ipcMain.on('saveBlade', (event, blade) => {

    db_blades.update({ _id: blade._id }, { $set: { content: blade.content } }, {}, function (err, numReplaced) {
        if (!err) {
            db_blades.find({}).sort({ updatedAt: -1 }).exec(function (err, blades) {
                if (!err) {
                    mainWindow.webContents.send('blade:saved', blades);
                }
            });
        }
    });

});

ipcMain.on('deleteBlade', (event, ID) => {

    db_blades.remove({ _id: ID }, {}, function (err, numRemoved) {
        if (!err) {
            db_blades.find({}).sort({ updatedAt: -1 }).exec(function (err, blades) {
                if (!err) {
                    mainWindow.webContents.send('blade:deleted', blades);
                }
            });
        }
    });

});

// Custom App Menu
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    }
];

// Show Developer Tools if running on Dev env
if (isDev) {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}

// Push additional submenu for Mac only
if (process.platform === 'darwin') {
    const name = app.getName()
    menuTemplate.unshift({
        label: name,
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
}