const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => process.platform,
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
})
