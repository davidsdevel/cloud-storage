const { app, BrowserWindow, ipcMain } = require('electron');
const {updateAuthFile, getConfigData} = require('./lib/auth');
const {join} = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  win.loadFile(join(__dirname, 'static/index.html'));
}

app.whenReady().then(() => {
  ipcMain.handle('isLogged', async () => {
    const {token} = await getConfigData();

    return !!token; 
  });

  ipcMain.handle('login', async token => {
    await updateAuthFile({token});

    return true; 
  });

  ipcMain.handle('logout', async () => {
    const {token} = await getConfigData();

    return !!token; 
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().lenght === 0)
      createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit();
})