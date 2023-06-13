const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('utils', {
  isLogged: () => ipcRenderer.invoke('isLogged'),
  login: () => ipcRenderer.invoke('login')
});
