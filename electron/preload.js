const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startConnection: (config) => ipcRenderer.invoke('start-connection', config),
  stopConnection: () => ipcRenderer.invoke('stop-connection'),
  getConnectionStatus: () => ipcRenderer.invoke('get-connection-status'),
  importConfig: () => ipcRenderer.invoke('import-config'),
  parseSubscription: (url) => ipcRenderer.invoke('parse-subscription', url),
  saveConfigs: (configs) => ipcRenderer.invoke('save-configs', configs),
  loadConfigs: () => ipcRenderer.invoke('load-configs'),
  connectFromLink: (link) => ipcRenderer.invoke('connect-from-link', link),
  onConnectionStatus: (callback) => {
    ipcRenderer.on('connection-status', (event, status) => callback(status));
  },
  onXrayLog: (callback) => {
    ipcRenderer.on('xray-log', (event, log) => callback(log));
  }
});
