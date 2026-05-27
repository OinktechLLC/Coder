import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, Download, Play, Settings, Bell, X, Maximize2,
  FileCode, ChevronRight, ChevronDown, Menu, Volume2, VolumeX,
  Monitor, Smartphone, AlertCircle
} from 'lucide-react';
import AdBanner from '../components/AdBanner';
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
  const [showAd, setShowAd] = useState(true);
  const [adConfig, setAdConfig] = useState({
    enabled: true,
    title: 'Специальное предложение!',
    url: 'https://example.com',
    imageUrl: ''
  });
  const [fullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [compilerOutput, setCompilerOutput] = useState([]);
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
        addNotification(`Файл ${file.name} загружен`, 'success');
        if (soundEnabled) playSound('startup');
      }
    };
    input.click();
  };

  const downloadProject = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile || 'project.pwn';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification('Проект скачан', 'success');
    if (soundEnabled) playSound('compile');
  };

  const compileCode = async () => {
    setIsCompiling(true);
    setCompilerOutput([]);
    
    if (soundEnabled) playSound('compile');
    
    try {
      // Convert Russian to code if needed
      const processedCode = RussianToCode.convert(code);
      
      let result;
      if (language === 'pawno') {
        result = Compiler.compilePawno(processedCode);
      } else {
        result = Compiler.compileGeneric(processedCode, language);
      }
      
      setCompilerOutput(result.output);
      setOutput(result.output.join('\n'));
      
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const sendPushToAll = (message) => {
    // In a real app, this would use WebSocket or similar
    addNotification('Пуш-уведомление отправлено всем пользователям', 'info');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Coder-Pawno', {
          body: message,
          icon: '/vite.svg'
        });
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#1e1e1e',
      overflow: 'hidden'
    }}>
      {/* Ad Banner */}
      {showAd && adConfig.enabled && (
        <AdBanner 
          config={adConfig} 
          onClose={() => setShowAd(false)} 
        />
      )}

      {/* Notifications */}
      <div style={{
        position: 'fixed',
        top: showAd ? '80px' : '20px',
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
                ПРОЕКТ
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  onClick={loadProject}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                >
                  Загрузить
                </button>
                <button
                  onClick={downloadProject}
                  className="btn-primary"
                  style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                >
                  Скачать
                </button>
              </div>

              {files.length > 0 && (
                <div>
                  {files.map((file, index) => (
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
                      <FileCode size={16} />
                      {file.name}
                    </div>
                  ))}
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
                  Настройки рекламы
                </div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '13px',
                  marginBottom: '12px'
                }}>
                  <input
                    type="checkbox"
                    checked={adConfig.enabled}
                    onChange={(e) => setAdConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                  Показывать рекламу
                </label>
                <input
                  type="text"
                  placeholder="Название рекламы"
                  value={adConfig.title}
                  onChange={(e) => setAdConfig(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#3c3c3c',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '13px',
                    marginBottom: '8px'
                  }}
                />
                <input
                  type="url"
                  placeholder="URL рекламы"
                  value={adConfig.url}
                  onChange={(e) => setAdConfig(prev => ({ ...prev, url: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#3c3c3c',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '13px'
                  }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Editor
            height="60%"
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
              tabSize: 4
            }}
          />

          {/* Output Panel */}
          <div style={{
            height: '40%',
            background: '#1e1e1e',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: '#252526',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <ChevronDown size={18} style={{ marginRight: '8px', color: 'rgba(255, 255, 255, 0.5)' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: '600' }}>
                КОНСОЛЬ КОМПИЛЯТОРА
              </span>
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
                    color: line.includes('Error') ? '#ef4444' : line.includes('Warning') ? '#f59e0b' : 'rgba(255, 255, 255, 0.7)'
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
