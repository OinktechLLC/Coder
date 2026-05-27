import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, Download, Play, Bell, X, Maximize2,
  FileCode, ChevronRight, ChevronDown, Menu, Volume2, VolumeX,
  Monitor, Smartphone, AlertCircle, Send, Upload, Archive,
  Search, FileText, Settings, Minimize2
} from 'lucide-react';
import JSZip from 'jszip';
import PushNotification from '../components/PushNotification';
import Compiler from '../utils/compiler';
import RussianToCode from '../utils/russianToCode';

const EditorPage = () => {
  const [code, setCode] = useState('// Добро пожаловать в Coder-Pawno!\n// Пишите код на русском или используйте обычный синтаксис\n\nmain() {\n    Print("Привет, мир!");\n}');
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [language, setLanguage] = useState('pawno');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [compilerOutput, setCompilerOutput] = useState([]);
  const [ws, setWs] = useState(null);
  const [pushLogs, setPushLogs] = useState([]);
  const [adminMessage, setAdminMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectName, setProjectName] = useState('');
  const [showOutputPanel, setShowOutputPanel] = useState(true);
  const [lastCompiledResult, setLastCompiledResult] = useState(null);
  const [outputHeight, setOutputHeight] = useState(40);
  const editorRef = useRef(null);

  // Push notification on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Coder-Pawno', {
        body: 'Редактор запущен! Готовы к работе?',
        icon: '/vite.svg'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // Play startup sound
    if (soundEnabled) {
      playSound('startup');
    }

    // Add welcome notification
    addNotification('Добро пожаловать в Coder-Pawno!', 'info');

    // Connect to WebSocket for push notifications
    const wsUrl = window.location.hostname === 'localhost' 
      ? 'ws://localhost:3000' 
      : `wss://${window.location.host}`;
    
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('Connected to push server');
      setWs(websocket);
    };
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PUSH_NOTIFICATION') {
          const { message, type } = data.payload;
          addNotification(message, type);
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Coder-Pawno', {
              body: message,
              icon: '/vite.svg'
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    websocket.onclose = () => {
      console.log('Disconnected from push server');
      setWs(null);
    };
    
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const playSound = (type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'startup') {
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'compile') {
      oscillator.frequency.value = 1200;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'error') {
      oscillator.frequency.value = 400;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const loadProject = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pwn,.txt,.js,.py,.cpp,.c,.java';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const content = await file.text();
        setCode(content);
        setCurrentFile(file.name);
        setFiles(prev => [...prev, { name: file.name, content }]);
        // Set project name from first loaded file
        if (!projectName) {
          setProjectName(file.name.replace(/\.[^/.]+$/, ''));
        }
        addNotification(`Файл ${file.name} загружен`, 'success');
        if (soundEnabled) playSound('startup');
      }
    };
    input.click();
  };

  const loadZipProject = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        setIsCompiling(true);
        addNotification('Распаковка архива...', 'info');

        const zip = new JSZip();
        const zipContents = await zip.loadAsync(file);
        
        const loadedFiles = [];
        let mainFile = null;
        let mainCode = '';

        // Process all files in the zip
        const filePromises = Object.keys(zipContents.files).map(async (filename) => {
          const zipFile = zipContents.files[filename];
          
          if (zipFile.dir) return; // Skip directories
          
          // Skip common non-code files
          if (filename.endsWith('/') || 
              filename.includes('__MACOSX') || 
              filename.startsWith('.') ||
              filename.includes('node_modules')) {
            return;
          }

          const ext = filename.split('.').pop().toLowerCase();
          const supportedExts = ['pwn', 'txt', 'js', 'py', 'cpp', 'c', 'java', 'inc', 'sma'];
          
          if (!supportedExts.includes(ext)) return;

          try {
            const content = await zipFile.async('text');
            loadedFiles.push({ name: filename, content });

            // Look for main file (.pwn for Pawno, .js for JS, etc.)
            if (!mainFile && (ext === 'pwn' || ext === 'js' || ext === 'py')) {
              // Prefer files named "main" or the first one found
              if (filename.toLowerCase().includes('main') || !mainFile) {
                mainFile = filename;
                mainCode = content;
              }
            }
          } catch (error) {
            console.error(`Error reading ${filename}:`, error);
          }
        });

        await Promise.all(filePromises);

        if (loadedFiles.length === 0) {
          addNotification('Нет поддерживаемых файлов в архиве', 'error');
          setIsCompiling(false);
          return;
        }

        // Set all files
        setFiles(loadedFiles);

        // Load main file into editor or the first .pwn file
        if (mainFile) {
          setCode(mainCode);
          setCurrentFile(mainFile);
          addNotification(`Проект загружен: ${loadedFiles.length} файл(ов)`, 'success');
        } else {
          const firstFile = loadedFiles[0];
          setCode(firstFile.content);
          setCurrentFile(firstFile.name);
          addNotification(`Проект загружен: ${loadedFiles.length} файл(ов)`, 'success');
        }

        // Set project name from zip file
        setProjectName(file.name.replace(/\.[^/.]+$/, ''));

        if (soundEnabled) playSound('startup');
      } catch (error) {
        console.error('Error loading ZIP:', error);
        addNotification('Ошибка при распаковке архива', 'error');
        if (soundEnabled) playSound('error');
      } finally {
        setIsCompiling(false);
      }
    };
    input.click();
  };

  const downloadProject = () => {
    if (files.length > 1) {
      // Download all files as ZIP
      const zip = new JSZip();
      
      // Add all files to zip
      files.forEach(file => {
        zip.file(file.name, file.content);
      });
      
      // Generate and download zip
      zip.generateAsync({ type: 'blob' }).then(content => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName || 'project'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addNotification(`Проект скачан как ${projectName || 'project'}.zip`, 'success');
      });
    } else {
      // Download single file
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile || `${projectName || 'project'}.pwn`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification('Файл скачан', 'success');
    }
    if (soundEnabled) playSound('compile');
  };

  const compileCode = async () => {
    setIsCompiling(true);
    setCompilerOutput([]);
    setShowOutputPanel(true);
    
    if (soundEnabled) playSound('compile');
    
    try {
      // Convert Russian to code if needed
      const processedCode = RussianToCode.convert(code);
      
      let result;
      if (language === 'pawno') {
        result = Compiler.compilePawno(processedCode);
      } else {
        result = Compiler.compile(processedCode, language);
      }
      
      setCompilerOutput(result.output);
      setOutput(result.output.join('\n'));
      setLastCompiledResult(result);
      
      if (result.success) {
        addNotification('Компиляция успешна!', 'success');
      } else {
        addNotification('Ошибки компиляции', 'error');
        if (soundEnabled) playSound('error');
      }
    } catch (error) {
      setCompilerOutput([`Ошибка: ${error.message}`]);
      addNotification('Критическая ошибка', 'error');
      if (soundEnabled) playSound('error');
    }
    
    setIsCompiling(false);
  };

  const toggleOutputPanel = () => {
    setShowOutputPanel(!showOutputPanel);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const sendPushToAll = async (message) => {
    if (!message.trim()) {
      addNotification('Введите текст уведомления', 'error');
      return;
    }

    try {
      const response = await fetch('/api/admin/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type: 'ad' })
      });

      const result = await response.json();
      
      if (result.success) {
        // Log the sent notification
        const logEntry = {
          id: Date.now(),
          message,
          timestamp: new Date().toISOString(),
          recipientsCount: activeUsersCount
        };
        setPushLogs(prev => [logEntry, ...prev]);
        addNotification('Рекламное пуш-уведомление отправлено!', 'success');
        setAdminMessage('');
      } else {
        addNotification('Ошибка отправки уведомления', 'error');
      }
    } catch (error) {
      console.error('Error sending push:', error);
      addNotification('Ошибка соединения с сервером', 'error');
    }
  };

  const [activeUsersCount, setActiveUsersCount] = useState(0);

  // Update active users count from WebSocket
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'WELCOME') {
            setActiveUsersCount(data.payload.activeUsers);
          } else if (data.type === 'PUSH_NOTIFICATION') {
            const { message, type } = data.payload;
            addNotification(message, type);
            
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Coder-Pawno', {
                body: message,
                icon: '/vite.svg'
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }
  }, [ws]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#1e1e1e',
      overflow: 'auto'
    }}>
      {/* Notifications */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000
      }}>
        {notifications.map(notification => (
          <PushNotification
            key={notification.id}
            message={notification.message}
            type={notification.type}
          />
        ))}
      </div>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#252526',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <Menu size={20} />
          </button>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Coder-Pawno
          </div>
          {currentFile && (
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
              {currentFile}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: '#3c3c3c',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <option value="pawno">Pawno</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: 'transparent',
              border: 'none',
              color: soundEnabled ? '#667eea' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            onClick={toggleFullscreen}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <Maximize2 size={20} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <Settings size={20} />
          </button>

          <button
            onClick={compileCode}
            disabled={isCompiling}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px'
            }}
          >
            <Play size={18} />
            {isCompiling ? 'Компиляция...' : 'Компилировать'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            style={{
              background: '#252526',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px' }}>
              {/* Project Name Display */}
              {projectName && (
                <div style={{
                  marginBottom: '12px',
                  padding: '8px 12px',
                  background: 'rgba(102, 126, 234, 0.15)',
                  borderRadius: '6px',
                  border: '1px solid rgba(102, 126, 234, 0.3)'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '4px'
                  }}>
                    ПРОЕКТ
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#667eea',
                    wordBreak: 'break-all'
                  }}>
                    {projectName}
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <FolderOpen size={18} />
                ФАЙЛЫ
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  onClick={loadProject}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FileCode size={14} />
                  Файл
                </button>
                <button
                  onClick={loadZipProject}
                  className="btn-primary"
                  style={{ flex: 1, padding: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Archive size={14} />
                  ZIP
                </button>
              </div>

              <button
                onClick={downloadProject}
                className="btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}
              >
                <Download size={14} />
                Скачать проект
              </button>

              <button
                onClick={() => {
                  if (!lastCompiledResult || !lastCompiledResult.binary) {
                    addNotification('Сначала скомпилируйте код', 'error');
                    return;
                  }
                  try {
                    const binaryData = atob(lastCompiledResult.binary);
                    const arrayBuffer = new ArrayBuffer(binaryData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    for (let i = 0; i < binaryData.length; i++) {
                      uint8Array[i] = binaryData.charCodeAt(i);
                    }
                    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = lastCompiledResult.filename || 'compiled.bin';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    addNotification(`Файл ${lastCompiledResult.filename} скачан`, 'success');
                    if (soundEnabled) playSound('compile');
                  } catch (error) {
                    addNotification('Ошибка при скачивании', 'error');
                  }
                }}
                className="btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px', backgroundColor: lastCompiledResult ? '#10b981' : '#3c3c3c', opacity: lastCompiledResult ? 1 : 0.5 }}
              >
                <Download size={14} />
                Скачать скомпилированный файл
              </button>

              {/* Search Files */}
              {files.length > 0 && (
                <div style={{
                  position: 'relative',
                  marginBottom: '12px'
                }}>
                  <Search 
                    size={16} 
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255, 255, 255, 0.4)'
                    }} 
                  />
                  <input
                    type="text"
                    placeholder="Поиск файлов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 36px',
                      background: '#3c3c3c',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {files.length > 0 && (
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {files
                    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((file, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setCode(file.content);
                        setCurrentFile(file.name);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: currentFile === file.name ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px'
                      }}
                    >
                      <FileText size={16} />
                      {file.name}
                    </div>
                  ))}
                  {files.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontSize: '13px'
                    }}>
                      Файлы не найдены
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div style={{
                padding: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  Админ-панель: Пуш-уведомления
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: activeUsersCount > 0 ? '#10b981' : '#ef4444'
                }}>
                  <Monitor size={16} />
                  Активных пользователей: {activeUsersCount}
                </div>
                
                <textarea
                  placeholder="Введите текст рекламного уведомления..."
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#3c3c3c',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '13px',
                    resize: 'none',
                    marginBottom: '8px'
                  }}
                />
                
                <button
                  onClick={() => sendPushToAll(adminMessage)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13px'
                  }}
                >
                  <Send size={16} />
                  Отправить всем
                </button>
                
                {pushLogs.length > 0 && (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      История отправок:
                    </div>
                    {pushLogs.slice(0, 5).map(log => (
                      <div
                        key={log.id}
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          marginBottom: '4px',
                          wordBreak: 'break-word'
                        }}
                      >
                        <span style={{ color: '#10b981' }}>✓</span> {log.message} 
                        <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.3)' }}>
                          ({new Date(log.timestamp).toLocaleTimeString()})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Editor
            height={showOutputPanel ? `${100 - outputHeight}%` : '100%'}
            theme="vs-dark"
            language={language === 'pawno' ? 'java' : language}
            value={code}
            onChange={(value) => setCode(value)}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: 'on'
            }}
          />

          {/* Output Panel */}
          {showOutputPanel && (
            <div style={{
              height: `${outputHeight}%`,
              background: '#1e1e1e',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#252526',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronDown size={18} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: '600' }}>
                    КОНСОЛЬ КОМПИЛЯТОРА
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setShowOutputPanel(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Закрыть панель"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div style={{
                flex: 1,
                padding: '16px',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '13px',
                overflow: 'auto',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {compilerOutput.length > 0 ? (
                  compilerOutput.map((line, index) => (
                    <div key={index} style={{ 
                      marginBottom: '4px',
                      color: line.includes('Error') || line.includes('error') ? '#ef4444' : line.includes('Warning') ? '#f59e0b' : 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {line}
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                    Нажмите "Компилировать" для запуска компиляции...
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!showOutputPanel && (
            <button
              onClick={() => setShowOutputPanel(true)}
              style={{
                position: 'absolute',
                bottom: '60px',
                right: '20px',
                background: '#252526',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                zIndex: 100
              }}
            >
              <ChevronDown size={16} />
              Консоль
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 16px',
        background: '#007acc',
        color: 'white',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Ready</span>
          <span>{language.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Ln {code.split('\n').length}, Col 1</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
