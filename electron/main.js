const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let xrayProcess = null;
let isConnected = false;
let currentConfig = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e'
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(startUrl);
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    stopXray();
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  stopXray();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Xray Process Management
function startXray(config) {
  if (xrayProcess) {
    stopXray();
  }

  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    const xrayPath = process.platform === 'win32' 
      ? path.join(__dirname, 'bin/xray.exe') 
      : path.join(__dirname, 'bin/xray');

    xrayProcess = spawn(xrayPath, ['run', '-c', configPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    xrayProcess.stdout.on('data', (data) => {
      console.log(`Xray: ${data}`);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('xray-log', data.toString());
      }
    });

    xrayProcess.stderr.on('data', (data) => {
      console.error(`Xray Error: ${data}`);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('xray-log', `ERROR: ${data}`);
      }
    });

    xrayProcess.on('close', (code) => {
      console.log(`Xray process exited with code ${code}`);
      isConnected = false;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('connection-status', false);
      }
    });

    isConnected = true;
    currentConfig = config;
    
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('connection-status', true);
      }
    }, 2000);

    return true;
  } catch (error) {
    console.error('Failed to start Xray:', error);
    return false;
  }
}

function stopXray() {
  if (xrayProcess) {
    xrayProcess.kill();
    xrayProcess = null;
  }
  isConnected = false;
  currentConfig = null;
}

// IPC Handlers
ipcMain.handle('start-connection', async (event, config) => {
  const success = startXray(config);
  return { success, message: success ? 'Connected' : 'Failed to connect' };
});

ipcMain.handle('stop-connection', async () => {
  stopXray();
  return { success: true, message: 'Disconnected' };
});

ipcMain.handle('get-connection-status', async () => {
  return { connected: isConnected, config: currentConfig };
});

ipcMain.handle('import-config', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Config Files', extensions: ['json', 'txt'] }]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const content = fs.readFileSync(result.filePaths[0], 'utf8');
      
      // Parse subscription link or config
      if (content.startsWith('vmess://') || content.startsWith('vless://') || 
          content.startsWith('trojan://') || content.startsWith('ss://')) {
        return { success: true, type: 'link', data: content.trim() };
      }
      
      // Try parsing as JSON config
      const config = JSON.parse(content);
      return { success: true, type: 'config', data: config };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, error: 'No file selected' };
});

ipcMain.handle('parse-subscription', async (event, url) => {
  try {
    const https = require('https');
    const http = require('http');
    
    return new Promise((resolve) => {
      const lib = url.startsWith('https') ? https : http;
      
      lib.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const decoded = Buffer.from(data, 'base64').toString('utf8');
            const links = decoded.split('\n').filter(line => line.trim());
            resolve({ success: true, links });
          } catch {
            resolve({ success: false, error: 'Invalid subscription format' });
          }
        });
      }).on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-configs', async (event, configs) => {
  try {
    const configPath = path.join(app.getPath('userData'), 'saved-configs.json');
    fs.writeFileSync(configPath, JSON.stringify(configs, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-configs', async () => {
  try {
    const configPath = path.join(app.getPath('userData'), 'saved-configs.json');
    if (fs.existsSync(configPath)) {
      const configs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return { success: true, configs };
    }
    return { success: true, configs: [] };
  } catch (error) {
    return { success: false, error: error.message, configs: [] };
  }
});

// Decode vmess link
function decodeVmess(link) {
  try {
    const base64Data = link.replace('vmess://', '');
    const decoded = Buffer.from(base64Data, 'base64').toString('utf8');
    const config = JSON.parse(decoded);
    
    return {
      add: config.add,
      port: config.port,
      id: config.id,
      aid: config.aid || 0,
      net: config.net || 'tcp',
      type: config.type || 'none',
      host: config.host || '',
      path: config.path || '',
      tls: config.tls || '',
      sni: config.sni || config.host || '',
      alpn: config.alpn || ''
    };
  } catch {
    return null;
  }
}

// Convert to Xray config
function linkToXrayConfig(link, tag = 'proxy') {
  let config;
  
  if (link.startsWith('vmess://')) {
    const vmess = decodeVmess(link);
    if (!vmess) return null;
    
    config = {
      log: { loglevel: 'warning' },
      inbound: {
        port: 10808,
        protocol: 'socks',
        settings: { auth: 'noauth', udp: true },
        sniffing: { enabled: true, destOverride: ['http', 'tls'] }
      },
      outbound: {
        tag,
        protocol: 'vmess',
        settings: {
          vnext: [{
            address: vmess.add,
            port: parseInt(vmess.port),
            users: [{
              id: vmess.id,
              alterId: vmess.aid,
              security: 'auto'
            }]
          }]
        },
        streamSettings: {
          network: vmess.net,
          security: vmess.tls === 'tls' ? 'tls' : undefined,
          tlsSettings: vmess.tls === 'tls' ? { serverName: vmess.sni } : undefined,
          tcpSettings: vmess.net === 'tcp' && vmess.type === 'http' ? {
            header: {
              type: 'http',
              request: {
                headers: { Host: [vmess.host] }
              }
            }
          } : undefined,
          wsSettings: vmess.net === 'ws' ? {
            headers: { Host: vmess.host },
            path: vmess.path
          } : undefined,
          grpcSettings: vmess.net === 'grpc' ? { serviceName: vmess.path } : undefined
        }
      },
      routing: {
        domainStrategy: 'AsIs',
        rules: [
          { type: 'field', ip: ['geoip:private'], outboundTag: 'direct' },
          { type: 'field', outboundTag: tag, domain: ['geosite:category-ads-all'] },
          { type: 'field', outboundTag: tag, port: '0-65535' }
        ]
      }
    };
  } else if (link.startsWith('vless://')) {
    // Parse VLESS link
    const url = new URL(link.replace('vless://', 'vless://'));
    config = {
      log: { loglevel: 'warning' },
      inbound: {
        port: 10808,
        protocol: 'socks',
        settings: { auth: 'noauth', udp: true },
        sniffing: { enabled: true, destOverride: ['http', 'tls'] }
      },
      outbound: {
        tag,
        protocol: 'vless',
        settings: {
          vnext: [{
            address: url.hostname,
            port: parseInt(url.port),
            users: [{
              id: url.username,
              encryption: 'none',
              flow: url.searchParams.get('flow') || ''
            }]
          }]
        },
        streamSettings: {
          network: url.searchParams.get('type') || 'tcp',
          security: url.searchParams.get('security') || 'none',
          tlsSettings: url.searchParams.get('security') === 'tls' ? {
            serverName: url.searchParams.get('sni') || url.hostname
          } : undefined,
          realitySettings: url.searchParams.get('security') === 'reality' ? {
            publicKey: url.searchParams.get('pbk'),
            serverName: url.searchParams.get('sni'),
            fingerprint: url.searchParams.get('fp') || 'chrome'
          } : undefined,
          wsSettings: url.searchParams.get('type') === 'ws' ? {
            headers: { Host: url.searchParams.get('host') || url.hostname },
            path: url.searchParams.get('path') || '/'
          } : undefined,
          grpcSettings: url.searchParams.get('type') === 'grpc' ? {
            serviceName: url.searchParams.get('serviceName') || ''
          } : undefined
        }
      }
    };
  } else if (link.startsWith('trojan://')) {
    const url = new URL(link.replace('trojan://', 'trojan://'));
    config = {
      log: { loglevel: 'warning' },
      inbound: {
        port: 10808,
        protocol: 'socks',
        settings: { auth: 'noauth', udp: true },
        sniffing: { enabled: true, destOverride: ['http', 'tls'] }
      },
      outbound: {
        tag,
        protocol: 'trojan',
        settings: {
          servers: [{
            address: url.hostname,
            port: parseInt(url.port),
            password: decodeURIComponent(url.username)
          }]
        },
        streamSettings: {
          network: url.searchParams.get('type') || 'tcp',
          security: 'tls',
          tlsSettings: {
            serverName: url.searchParams.get('sni') || url.hostname
          },
          wsSettings: url.searchParams.get('type') === 'ws' ? {
            headers: { Host: url.searchParams.get('host') || url.hostname },
            path: url.searchParams.get('path') || '/'
          } : undefined
        }
      }
    };
  } else if (link.startsWith('ss://')) {
    // Shadowsocks
    const base64Data = link.replace('ss://', '').split('#')[0];
    const decoded = Buffer.from(base64Data, 'base64').toString('utf8');
    const parts = decoded.split('@');
    const methodAndPassword = parts[0].split(':');
    const hostPort = parts[1].split(':');
    
    config = {
      log: { loglevel: 'warning' },
      inbound: {
        port: 10808,
        protocol: 'socks',
        settings: { auth: 'noauth', udp: true },
        sniffing: { enabled: true, destOverride: ['http', 'tls'] }
      },
      outbound: {
        tag,
        protocol: 'shadowsocks',
        settings: {
          servers: [{
            address: hostPort[0],
            port: parseInt(hostPort[1]),
            method: methodAndPassword[0],
            password: methodAndPassword[1]
          }]
        }
      }
    };
  }
  
  return config;
}

ipcMain.handle('connect-from-link', async (event, link) => {
  const config = linkToXrayConfig(link.trim());
  if (!config) {
    return { success: false, error: 'Invalid link format' };
  }
  
  const success = startXray(config);
  return { success, message: success ? 'Connected' : 'Failed to connect' };
});
