import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

const LandingPage = () => {
  const navigate = useNavigate();
  const { agreedToTerms, setAgreedToTerms } = useAppStore();
  const [showTerms, setShowTerms] = useState(false);

  const handleEnterEditor = () => {
    if (!agreedToTerms) {
      setShowTerms(true);
      return;
    }
    navigate('/editor');
  };

  const handleAgreeTerms = () => {
    setAgreedToTerms(true);
    setShowTerms(false);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-premium-950 via-premium-900 to-premium-800 animate-gradient" />
      
      {/* Плавающие элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-premium-500/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Контент */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">Coder-Pawno</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4">
            Кайфуйте от программирования
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Пишите на русском, а наша система переведет его на понятный язык программирования
          </p>
        </motion.header>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {[
            {
              icon: '🚀',
              title: 'Русский синтаксис',
              description: 'Пишите код на русском языке - система автоматически переведет'
            },
            {
              icon: '⚡',
              title: 'Мгновенная компиляция',
              description: 'Компилятор Pawno и других языков прямо в браузере'
            },
            {
              icon: '🎨',
              title: 'Премиум дизайн 2026',
              description: 'Современный интерфейс в стиле будущего'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              className="card-premium glass-dark p-8 text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 gradient-text">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleEnterEditor}
            className="btn-premium text-2xl px-12 py-6 glow-hover"
          >
            Начать программировать
          </button>
          
          {!agreedToTerms && (
            <p className="mt-4 text-sm text-gray-400">
              При нажатии вы соглашаетесь с{' '}
              <button
                onClick={() => navigate('/terms')}
                className="text-premium-400 hover:text-premium-300 underline"
              >
                условиями использования
              </button>
            </p>
          )}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center gap-8 mt-12"
        >
          <button
            onClick={() => navigate('/docs')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Документация
          </button>
          <button
            onClick={() => navigate('/faq')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Политика конфиденциальности
          </button>
        </motion.div>
      </div>

      {/* Modal для условий использования */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-dark p-8 rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold mb-6 gradient-text">Условия использования</h2>
            
            <div className="space-y-4 text-gray-300 mb-8">
              <p>
                Добро пожаловать в Coder-Pawno! Используя это приложение, вы соглашаетесь со следующими условиями:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Приложение предоставляет возможности редактирования и компиляции кода</li>
                <li>Вы можете писать код на русском языке с автоматическим переводом</li>
                <li>Рекламные баннеры могут отображаться во время работы</li>
                <li>Пуш-уведомления используются для информирования о событиях</li>
                <li>Ваши проекты хранятся локально в браузере</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAgreeTerms}
                className="btn-premium flex-1"
              >
                Принять и продолжить
              </button>
              <button
                onClick={() => setShowTerms(false)}
                className="px-6 py-3 rounded-xl border border-gray-600 hover:border-gray-400 transition-colors"
              >
                Отмена
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
