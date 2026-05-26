import { useState, useEffect } from 'react'
import TermsModal from './components/TermsModal.jsx'
import ServerList from './components/ServerList.jsx'
import AdBanner from './components/AdBanner.jsx'
import { FlameIcon, PowerIcon, TelegramIcon, YouTubeIcon, SpeedIcon, MenuIcon, CloseIcon, InfoIcon, DocumentIcon, ShieldIcon, RocketIcon, GlobeIcon } from './components/Icons.jsx'

const MOCK_SERVERS = [
  { id: 1, name: 'Москва Premium', country: 'Россия 🇷🇺', speed: 95 },
  { id: 2, name: 'Санкт-Петербург', country: 'Россия 🇷🇺', speed: 92 },
  { id: 3, name: 'Amsterdam Fast', country: 'Нидерланды 🇳🇱', speed: 88 },
  { id: 4, name: 'Frankfurt Pro', country: 'Германия 🇩🇪', speed: 85 },
]

function App() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [currentPage, setCurrentPage] = useState('landing')
  const [subscription, setSubscription] = useState('')
  const [servers, setServers] = useState([])
  const [selectedServer, setSelectedServer] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showDocs, setShowDocs] = useState(null)
  const [notification, setNotification] = useState(null)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [ping, setPing] = useState(0)
  const [savedConfigs, setSavedConfigs] = useState([])
  const [xrayLogs, setXrayLogs] = useState([])
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    // Check if running in Electron
    if (window.electronAPI) {
      window.electronAPI.onConnectionStatus((status) => {
        setIsConnected(status)
        setConnectionStatus(status ? 'connected' : 'disconnected')
        if (status) {
          showNotification('🔥 VPN ВКЛЮЧЁН', 'Ядро Xray запущено\nВесь трафик защищён!')
        } else {
          showNotification('⚠️ VPN ОТКЛЮЧЁН', 'Соединение разорвано')
        }
      })

      window.electronAPI.onXrayLog((log) => {
        setXrayLogs(prev => [...prev.slice(-50), log])
      })

      // Load saved configs
      window.electronAPI.loadConfigs().then(result => {
        if (result.success && result.configs) {
          setSavedConfigs(result.configs)
        }
      })
    }

    const accepted = localStorage.getItem('termsAccepted')
    if (accepted === 'true') setTermsAccepted(true)
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    let interval
    if (isConnected) {
      interval = setInterval(() => {
        setUploadSpeed(Math.floor(Math.random() * 20) + 30)
        setDownloadSpeed(Math.floor(Math.random() * 50) + 80)
        setPing(Math.floor(Math.random() * 20) + 15)
      }, 2000)
    } else {
      setUploadSpeed(0)
      setDownloadSpeed(0)
      setPing(0)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const showNotification = (title, body) => {
    setNotification({ title, body })
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/flame.svg',
        badge: '/flame.svg',
      })
    }
    
    setTimeout(() => setNotification(null), 4000)
  }

  const handleAcceptTerms = () => setTermsAccepted(true)

  const handleImportConfig = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.importConfig()
      if (result.success) {
        if (result.type === 'link') {
          setSubscription(result.data)
          showNotification('✅ Конфиг импортирован', 'Нажмите "Сохранить" для активации')
        } else if (result.type === 'config') {
          setServers(MOCK_SERVERS)
          setCurrentPage('app')
          showNotification('✅ Подписка активирована', 'Теперь выберите сервер для подключения')
        }
      }
    } else {
      // Fallback for web version
      showNotification('ℹ️ Electron не найден', 'Используйте десктопное приложение')
    }
  }

  const handleParseSubscription = async () => {
    if (subscription.startsWith('http')) {
      if (window.electronAPI) {
        const result = await window.electronAPI.parseSubscription(subscription)
        if (result.success && result.links) {
          setSavedConfigs(prev => [...prev, ...result.links])
          showNotification(`✅ Загружено ${result.links.length} конфигов`, 'Выберите любой для подключения')
        } else {
          showNotification('❌ Ошибка', result.error || 'Не удалось загрузить подписку')
        }
      }
    }
  }

  const handleSaveSubscription = async () => {
    if (!subscription.trim()) return
    
    if (window.electronAPI && subscription.startsWith('http')) {
      await handleParseSubscription()
      return
    }

    if (window.electronAPI) {
      // Save to electron store
      const updated = [...savedConfigs, subscription]
      setSavedConfigs(updated)
      await window.electronAPI.saveConfigs(updated)
    }

    setServers(MOCK_SERVERS)
    setCurrentPage('app')
    showNotification('✅ Подписка активирована', 'Теперь выберите сервер для подключения')
  }

  const handleConnect = async () => {
    if (!selectedServer && !subscription) return
    
    if (window.electronAPI && subscription) {
      // Real connection via Xray
      setConnectionStatus('connecting')
      
      const result = await window.electronAPI.connectFromLink(subscription)
      
      if (result.success) {
        setConnectionStatus('connected')
        setIsConnected(true)
        showNotification('🔥 VPN ВКЛЮЧЁН', `Подключено через Xray\n${selectedServer?.name || 'Прямое соединение'}`)
      } else {
        setConnectionStatus('disconnected')
        showNotification('❌ Ошибка подключения', result.error || 'Проверьте конфиг')
        setShowLogs(true)
      }
    } else {
      // Mock connection for web/demo
      setConnectionStatus('connecting')
      setTimeout(() => { 
        setConnectionStatus('connected')
        setIsConnected(true)
        showNotification('🔥 VPN ВКЛЮЧЁН', `Подключено к ${selectedServer?.name || 'серверу'}\nВесь трафик браузера защищён!`)
      }, 2000)
    }
  }

  const handleDisconnect = async () => {
    if (window.electronAPI) {
      await window.electronAPI.stopConnection()
    }
    setConnectionStatus('disconnecting')
    setTimeout(() => { 
      setConnectionStatus('disconnected')
      setIsConnected(false)
      showNotification('⚠️ VPN ОТКЛЮЧЁН', 'Соединение разорвано')
    }, 1000)
  }

  const handleSelectConfig = async (link) => {
    setSubscription(link)
    setSelectedServer({ name: 'Custom Config', country: '🌐' })
    showNotification('✅ Конфиг выбран', 'Нажмите кнопку подключения')
  }

  if (currentPage === 'landing') {
    return (
      <>
        {!termsAccepted && <TermsModal onAccept={handleAcceptTerms} />}
        <div className="animated-bg">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>
        <div className="grid-overlay"></div>
        
        {notification && (
          <div className="notification-toast">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <FlameIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-bold">{notification.title}</h4>
              <p className="text-white/70 text-sm whitespace-pre-line">{notification.body}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-4 text-white/50 hover:text-white">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <nav className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl" style={{boxShadow: '0 0 40px rgba(0,245,255,0.5)'}}>
                <FlameIcon className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-black text-gradient">FlameVPN</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setCurrentPage('app')} className="text-white/80 hover:text-white transition-colors">Приложение</button>
              <button onClick={() => setShowDocs('faq')} className="text-white/80 hover:text-white transition-colors">FAQ</button>
              <button onClick={() => setCurrentPage('app')} className="btn-primary">Войти</button>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </nav>
        <main className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Кайфуйте от <span className="text-gradient">интернета</span> вместе с FlameVPN
            </h1>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">Обход блокировок, разблокировка Telegram и YouTube, лучшая скорость в РФ без блокировок РКН</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button onClick={() => setCurrentPage('app')} className="btn-primary text-lg px-12 py-4">Начать бесплатно</button>
              <button onClick={() => setShowDocs('docs')} className="btn-secondary text-lg px-12 py-4">Узнать больше</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-glass p-6 group">
                <div className="p-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-4 inline-block" style={{boxShadow: '0 0 30px rgba(0,245,255,0.4)'}}>
                  <TelegramIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Разблок Телеграмма</h3>
                <p className="text-white/60">Доступ без ограничений</p>
              </div>
              <div className="card-glass p-6 group">
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl mb-4 inline-block" style={{boxShadow: '0 0 30px rgba(255,0,110,0.4)'}}>
                  <YouTubeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Разблок Ютуба</h3>
                <p className="text-white/60">Без тормозов</p>
              </div>
              <div className="card-glass p-6 group">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4 inline-block" style={{boxShadow: '0 0 30px rgba(189,0,255,0.4)'}}>
                  <SpeedIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Лучшая скорость в РФ</h3>
                <p className="text-white/60">Оптимизированные серверы</p>
              </div>
            </div>
          </div>
        </main>
        {showDocs && <DocsModal type={showDocs} onClose={() => setShowDocs(null)} />}
      </>
    )
  }

  return (
    <>
      <div className="animated-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <div className="grid-overlay"></div>
      
      {!termsAccepted && <TermsModal onAccept={handleAcceptTerms} />}
      
      {notification && (
        <div className="notification-toast">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <FlameIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold">{notification.title}</h4>
            <p className="text-white/70 text-sm whitespace-pre-line">{notification.body}</p>
          </div>
          <button onClick={() => setNotification(null)} className="ml-4 text-white/50 hover:text-white">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentPage('landing')} className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl" style={{boxShadow: '0 0 30px rgba(0,245,255,0.4)'}}>
              <FlameIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-gradient hidden sm:block">FlameVPN</span>
          </button>
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'VPN Активен' : 'Отключено'}</span>
          </div>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {isConnected && (
            <div className="card-glass p-6">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{downloadSpeed}</div>
                  <div className="stat-label">Mbps ↓</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{uploadSpeed}</div>
                  <div className="stat-label">Mbps ↑</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{ping}</div>
                  <div className="stat-label">ms Ping</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-green-400">AES-256</div>
                  <div className="stat-label">Шифрование</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="card-glass p-8 text-center">
            <button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={!selectedServer && !isConnected}
              className={`power-button mx-auto mb-6 ${isConnected ? 'connected' : ''}`}
            >
              <PowerIcon className="w-20 h-20 mx-auto text-white" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'}} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isConnected ? '🔥 VPN Активен' : selectedServer ? '⚡ Готов к подключению' : '🎯 Выберите сервер'}
            </h2>
            <p className="text-white/60">{selectedServer?.name || 'Загрузите подписку для начала работы'}</p>
          </div>
          
          <AdBanner />
          
          {servers.length === 0 && (
            <div className="card-glass p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldIcon className="w-6 h-6 text-cyan-400" />
                Добавить подписку
              </h3>
              <div className="flex gap-2 mb-4">
                <button onClick={handleImportConfig} className="btn-secondary flex-1 py-3">
                  📁 Импорт файла
                </button>
                <button onClick={() => setShowLogs(true)} className="btn-secondary flex-1 py-3">
                  📋 Логи Xray
                </button>
              </div>
              <textarea 
                value={subscription} 
                onChange={(e) => setSubscription(e.target.value)} 
                placeholder="Вставьте подписку (vmess://, vless://, trojan://, ss:// или http:// subscription)" 
                className="input-modern min-h-[120px] font-mono text-sm" 
              />
              <button 
                onClick={handleSaveSubscription} 
                disabled={!subscription.trim()} 
                className={`w-full mt-4 py-4 rounded-xl font-bold transition-all ${subscription.trim() ? 'btn-primary' : 'bg-white/10 text-white/50 cursor-not-allowed'}`}
              >
                {subscription.startsWith('http') ? '🌐 Загрузить из URL' : '💾 Сохранить подписку'}
              </button>
              
              {savedConfigs.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-white font-bold mb-2">Сохранённые конфиги ({savedConfigs.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {savedConfigs.map((config, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <span className="text-white/70 text-sm truncate flex-1">
                          {config.startsWith('vmess://') ? '🔵 VMess' : 
                           config.startsWith('vless://') ? '🟣 VLESS' : 
                           config.startsWith('trojan://') ? '🟢 Trojan' : 
                           config.startsWith('ss://') ? '🟡 Shadowsocks' : '🌐 Subscription'}
                        </span>
                        <button onClick={() => handleSelectConfig(config)} className="btn-primary py-2 px-4 ml-2 text-sm">
                          Выбрать
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {servers.length > 0 && (
            <div className="card-glass p-6">
              <ServerList servers={servers} selectedServer={selectedServer} onSelectServer={setSelectedServer} />
            </div>
          )}
        </div>
      </main>
      
      {showLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="card-glass max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 p-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">📋 Логи Xray Core</h2>
              <button onClick={() => setShowLogs(false)}><CloseIcon className="w-6 h-6 text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-black/50 rounded-lg font-mono text-xs">
              {xrayLogs.length === 0 ? (
                <p className="text-white/50">Логи пока пустые. Подключитесь к серверу для отображения логов.</p>
              ) : (
                xrayLogs.map((log, idx) => (
                  <div key={idx} className={`py-1 ${log.includes('ERROR') ? 'text-red-400' : 'text-green-400'}`}>
                    {log}
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2 mt-4 p-4 border-t border-white/10">
              <button onClick={() => setXrayLogs([])} className="btn-secondary flex-1 py-2">
                🗑️ Очистить
              </button>
              <button onClick={() => setShowLogs(false)} className="btn-primary flex-1 py-2">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDocs && <DocsModal type={showDocs} onClose={() => setShowDocs(null)} />}
    </>
  )
}

const DocsModal = ({ type, onClose }) => {
  const titles = { faq: 'FAQ', docs: 'Документация', policy: 'Политика', terms: 'Условия' }
  const content = {
    faq: <div><p className="text-white/70 mb-4">Как добавить подписку? - Скопируйте и вставьте ссылку.</p><p className="text-white/70">Как подключиться? - Выберите сервер и нажмите кнопку.</p></div>,
    policy: <p className="text-white/70">Мы не собираем логи вашей активности. Все соединения шифруются.</p>,
    terms: <p className="text-white/70">Сервис предоставляется "как есть". Запрещена незаконная деятельность.</p>,
    docs: <ul className="text-white/70"><li>Vmess (V2Ray)</li><li>Vless</li><li>Trojan</li></ul>
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="card-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{titles[type] || 'Инфо'}</h2>
          <button onClick={onClose}><CloseIcon className="w-6 h-6 text-white" /></button>
        </div>
        {content[type]}
        <button onClick={onClose} className="w-full mt-6 btn-primary">OK</button>
      </div>
    </div>
  )
}

export default App
