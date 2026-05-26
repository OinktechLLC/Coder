import { useState, useEffect } from 'react'
import TermsModal from './components/TermsModal.jsx'
import ServerList from './components/ServerList.jsx'
import AdBanner from './components/AdBanner.jsx'
import { FlameIcon, PowerIcon, TelegramIcon, YouTubeIcon, SpeedIcon, MenuIcon, CloseIcon, InfoIcon, DocumentIcon } from './components/Icons.jsx'

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

  useEffect(() => {
    const accepted = localStorage.getItem('termsAccepted')
    if (accepted === 'true') setTermsAccepted(true)
  }, [])

  const handleAcceptTerms = () => setTermsAccepted(true)

  const handleSaveSubscription = () => {
    if (subscription.trim()) {
      setServers(MOCK_SERVERS)
      setCurrentPage('app')
    }
  }

  const handleConnect = () => {
    if (!selectedServer) return
    setConnectionStatus('connecting')
    setTimeout(() => { setConnectionStatus('connected'); setIsConnected(true) }, 2000)
  }

  const handleDisconnect = () => {
    setConnectionStatus('disconnecting')
    setTimeout(() => { setConnectionStatus('disconnected'); setIsConnected(false) }, 1000)
  }

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400'
      case 'connecting': return 'text-yellow-400'
      case 'disconnecting': return 'text-red-400'
      default: return 'text-white/50'
    }
  }

  if (currentPage === 'landing') {
    return (
      <>
        {!termsAccepted && <TermsModal onAccept={handleAcceptTerms} />}
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-flame-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          </div>
          <nav className="relative z-10 container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-flame-500 to-flame-600 rounded-xl flame-glow">
                  <FlameIcon className="w-8 h-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">FlameVPN</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => setCurrentPage('app')} className="text-white/80 hover:text-white">Приложение</button>
                <button onClick={() => setShowDocs('faq')} className="text-white/80 hover:text-white">FAQ</button>
                <button onClick={() => setCurrentPage('app')} className="btn-primary">Войти</button>
              </div>
              <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </nav>
          <main className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                Кайфуйте от <span className="text-gradient">интернета</span> вместе с FlameVPN
              </h1>
              <p className="text-xl text-white/70 mb-12">Обход блокировок, разблокировка Telegram и YouTube</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button onClick={() => setCurrentPage('app')} className="btn-primary text-lg px-12 py-4">Начать бесплатно</button>
                <button onClick={() => setShowDocs('docs')} className="btn-secondary text-lg px-12 py-4">Узнать больше</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-glass p-6">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4 inline-block">
                    <TelegramIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Разблок Телеграмма</h3>
                  <p className="text-white/60">Доступ без ограничений</p>
                </div>
                <div className="card-glass p-6">
                  <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4 inline-block">
                    <YouTubeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Разблок Ютуба</h3>
                  <p className="text-white/60">Без тормозов</p>
                </div>
                <div className="card-glass p-6">
                  <div className="p-4 bg-gradient-to-br from-flame-500 to-flame-600 rounded-xl mb-4 inline-block">
                    <SpeedIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Лучшая скорость в РФ</h3>
                  <p className="text-white/60">Оптимизированные серверы</p>
                </div>
              </div>
            </div>
          </main>
        </div>
        {showDocs && <DocsModal type={showDocs} onClose={() => setShowDocs(null)} />}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {!termsAccepted && <TermsModal onAccept={handleAcceptTerms} />}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentPage('landing')} className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-flame-500 to-flame-600 rounded-xl flame-glow">
              <FlameIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">FlameVPN</span>
          </button>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isConnected ? 'bg-green-500/20' : 'bg-white/10'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-white/50'} animate-pulse`}></div>
            <span className={`text-sm font-medium ${getConnectionColor()}`}>{isConnected ? 'Подключено' : 'Отключено'}</span>
          </div>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="card-glass p-8 text-center">
            <button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={!selectedServer && !isConnected}
              className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 transition-all duration-500 ${
                isConnected ? 'bg-gradient-to-br from-green-500 to-green-600 flame-glow' :
                selectedServer ? 'bg-gradient-to-br from-flame-500 to-flame-600 hover:scale-105 flame-glow' :
                'bg-white/10 cursor-not-allowed'
              }`}
            >
              <PowerIcon className="w-16 h-16 md:w-20 md:h-20 mx-auto text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">{isConnected ? 'VPN Активен' : selectedServer ? 'Готов к подключению' : 'Выберите сервер'}</h2>
            <p className="text-white/60">{selectedServer?.name || 'Загрузите подписку'}</p>
          </div>
          <AdBanner />
          {servers.length === 0 && (
            <div className="card-glass p-6">
              <h3 className="text-xl font-bold text-white mb-4">Добавить подписку</h3>
              <textarea value={subscription} onChange={(e) => setSubscription(e.target.value)} placeholder="Вставьте подписку (vmess://, vless://)" className="input-modern min-h-[120px]" />
              <button onClick={handleSaveSubscription} disabled={!subscription.trim()} className={`w-full mt-4 py-4 rounded-xl font-bold ${subscription.trim() ? 'btn-primary' : 'bg-white/10 text-white/50'}`}>Сохранить</button>
            </div>
          )}
          {servers.length > 0 && (
            <div className="card-glass p-6">
              <ServerList servers={servers} selectedServer={selectedServer} onSelectServer={setSelectedServer} />
            </div>
          )}
        </div>
      </main>
      {showDocs && <DocsModal type={showDocs} onClose={() => setShowDocs(null)} />}
    </div>
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
