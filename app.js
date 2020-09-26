const { app, BrowserWindow } = require('electron');

function initialize() {
    try {
        let win = new BrowserWindow({
            autoHideMenuBar: true,
            title: 'Document to SQL',

            width: 800,
            height: 450,
            resizable: false,

            webPreferences: { nodeIntegration: true }
        });

        win.on('close', () => { win = null });
        win.loadFile('main.html');
    }
    catch (error) {
        console.log(`${error.name} occurred during initialization`, error.stack);
        app.quit();
    }
}

app.on('ready', initialize);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) initialize();
});