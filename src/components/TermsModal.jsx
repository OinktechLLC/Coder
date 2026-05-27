import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TermsModal = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '700px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px'
        }}>
          Условия использования
        </h2>

        <div style={{
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: '1.8',
          marginBottom: '24px',
          fontSize: '15px'
        }}>
          <p style={{ marginBottom: '16px' }}>
            Добро пожаловать в Coder-Pawno! Перед началом работы пожалуйста ознакомьтесь с условиями использования:
          </p>
          
          <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>1. Принятие условий</h3>
          <p style={{ marginBottom: '10px' }}>
            Используя данное приложение, вы соглашаетесь соблюдать все условия настоящего соглашения.
          </p>

          <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>2. Описание сервиса</h3>
          <p style={{ marginBottom: '10px' }}>
            Coder-Pawno предоставляет онлайн-редактор кода с поддержкой компиляции для Pawno и других языков программирования.
          </p>

          <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>3. Рекламные материалы</h3>
          <p style={{ marginBottom: '10px' }}>
            Приложение может содержать рекламные баннеры. Мы не несем ответственности за содержание рекламы.
          </p>

          <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>4. Конфиденциальность</h3>
          <p style={{ marginBottom: '10px' }}>
            Мы уважаем вашу конфиденциальность. Ваши проекты хранятся локально в браузере.
          </p>

          <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>5. Ограничения</h3>
          <p style={{ marginBottom: '10px' }}>
            Запрещено использовать сервис для создания вредоносного кода или нарушения законодательства.
          </p>
        </div>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          marginBottom: '24px',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
          />
          <span>Я прочитал и принимаю условия использования</span>
        </label>

        <button
          onClick={onAccept}
          disabled={!checked}
          style={{
            background: checked 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: checked ? 'pointer' : 'not-allowed',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          Принять и продолжить
        </button>
      </motion.div>
    </div>
  );
};

export default TermsModal;
