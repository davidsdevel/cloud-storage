const {updateAuthFile, getConfigData, login} = require('./lib/auth');
const {startSync} = require('./lib/sync');
const {app, BrowserWindow, ipcMain} = require('electron');
const {join} = require('path');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  ipcMain.handle('isLogged', async () => {
    const {token} = await getConfigData();

    return token; 
  });

  ipcMain.handle('login', async (_, {email, password}) => {
    try {
      const token = await login(email, password);

      if (!token)
        return null; 

      await updateAuthFile({token});

      return token; 
    } catch(err) {
      return null;
    }
  });

  startSync()
    .then(({socket}) => {
      socket.on('storage:update', size => mainWindow.webContents.send('update-storage', size))
    });

  mainWindow.loadFile(join(__dirname, 'static/index.html'));
}

app.whenReady().then(() => {
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