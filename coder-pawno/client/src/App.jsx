import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import DocsPage from './pages/DocsPage';
import PrivacyPage from './pages/PrivacyPage';
import AdBanner from './components/AdBanner';
import NotificationSystem from './components/NotificationSystem';
import { useAppStore } from './store/appStore';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { agreedToTerms, loadAdConfig } = useAppStore();
  const { connected } = useWebSocket();

  useEffect(() => {
    // Инициализация магазина в window для доступа из хуков
    window.appStore = useAppStore.getState();
    
    // Загрузка конфигурации рекламы
    loadAdConfig();
  }, [loadAdConfig]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'notification-toast',
          duration: 5000,
          style: {
            background: 'rgba(10, 10, 51, 0.95)',
            color: '#fff',
            border: '1px solid rgba(69, 69, 255, 0.3)',
          },
        }}
      />
      
      {/* Пуш-уведомления и звук */}
      <NotificationSystem />
      
      {/* Рекламный баннер (защищен от удаления) */}
      <AdBanner />
      
      {/* Индикатор WebSocket подключения */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 glass-dark px-4 py-2 rounded-full">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        <span className="text-xs text-gray-300">
          {connected ? 'Онлайн' : 'Оффлайн'}
        </span>
      </div>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={agreedToTerms ? <EditorPage /> : <LandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </>
  );
}

export default App;
