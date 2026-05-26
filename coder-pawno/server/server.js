const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Хранилище для пуш-уведомлений и активных пользователей
const activeUsers = new Set();
const notifications = [];

// Конфигурация рекламы (защищена от изменения клиентом)
const AD_CONFIG = {
  enabled: true,
  imageUrl: 'https://via.placeholder.com/728x90?text=REKLAMA',
  linkUrl: 'https://example.com',
  title: 'Рекламный баннер'
};

// API для получения рекламной конфигурации (только чтение для клиента)
app.get('/api/ad-config', (req, res) => {
  res.json({
    enabled: AD_CONFIG.enabled,
    imageUrl: AD_CONFIG.imageUrl,
    linkUrl: AD_CONFIG.linkUrl,
    title: AD_CONFIG.title
  });
});

// API для отправки пуш-уведомления администратором
app.post('/api/admin/push', (req, res) => {
  const { message, type = 'info' } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  
  const notification = {
    id: Date.now(),
    message,
    type,
    timestamp: new Date().toISOString()
  };
  
  notifications.push(notification);
  
  // Отправляем всем подключенным клиентам
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'PUSH_NOTIFICATION',
        payload: notification
      }));
    }
  });
  
  res.json({ success: true, notification });
});

// API для компиляции кода
app.post('/api/compile', async (req, res) => {
  const { code, language = 'pawno' } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code required' });
  }
  
  try {
    // Имитация компиляции (в продакшене здесь будет реальная компиляция)
    const result = {
      success: true,
      output: `Компиляция завершена успешно!\nЯзык: ${language}\nСтрок кода: ${code.split('\n').length}\nВремя компиляции: ${Math.random() * 2.toFixed(2)}s`,
      warnings: [],
      errors: []
    };
    
    // Простая валидация для Pawno
    if (language === 'pawno') {
      if (code.includes('main()')) {
        result.output += '\n✓ Функция main() найдена';
      } else {
        result.warnings.push('Функция main() не найдена');
      }
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API для конвертации русского текста в код
app.post('/api/translate-to-code', async (req, res) => {
  const { text, language = 'pawno' } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text required' });
  }
  
  try {
    // Словарь переводов для Pawno
    const translations = {
      'если': 'if',
      'иначе': 'else',
      'пока': 'while',
      'для': 'for',
      'функция': 'function',
      'вернуть': 'return',
      'переменная': 'var',
      'целое': 'int',
      'строка': 'string',
      'логическое': 'bool',
      'истина': 'true',
      'ложь': 'false',
      'создать': 'new',
      'удалить': 'delete',
      'печатать': 'print',
      'вывести': 'echo',
      'игрок': 'player',
      'транспорт': 'vehicle',
      'текст': 'textdraw',
      'меню': 'menu',
      'диалог': 'dialog',
      'таймер': 'settimer',
      'объект': 'object',
      'звук': 'playaudio',
      'анимация': 'applyanimation'
    };
    
    let translatedCode = text;
    
    // Замена русских ключевых слов
    Object.keys(translations).forEach(russian => {
      const regex = new RegExp(`\\b${russian}\\b`, 'gi');
      translatedCode = translatedCode.replace(regex, translations[russian]);
    });
    
    // Автодополнение синтаксиса
    translatedCode = autoCompleteSyntax(translatedCode, language);
    
    res.json({
      success: true,
      originalText: text,
      translatedCode,
      language
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

function autoCompleteSyntax(code, language) {
  // Автоматическое добавление скобок, точек с запятой и т.д.
  let result = code;
  
  // Добавляем точку с запятой в конце строк, если её нет
  const lines = result.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed && 
        !trimmed.endsWith(';') && 
        !trimmed.endsWith('{') && 
        !trimmed.endsWith('}') &&
        !trimmed.endsWith(':') &&
        !trimmed.startsWith('//') &&
        !trimmed.startsWith('#')) {
      return line + ';';
    }
    return line;
  });
  
  result = processedLines.join('\n');
  
  return result;
}

// WebSocket соединение для реального времени
wss.on('connection', (ws) => {
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  activeUsers.add(userId);
  
  console.log(`Пользователь подключился: ${userId}. Всего активных: ${activeUsers.size}`);
  
  // Отправляем приветственное уведомление
  ws.send(JSON.stringify({
    type: 'WELCOME',
    payload: {
      message: 'Добро пожаловать в Coder-Pawno!',
      userId,
      activeUsers: activeUsers.size
    }
  }));
  
  // Отправляем накопленные уведомления
  notifications.slice(-10).forEach(notification => {
    ws.send(JSON.stringify({
      type: 'PUSH_NOTIFICATION',
      payload: notification
    }));
  });
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Рассылаем сообщение другим пользователям (для совместной работы)
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'USER_MESSAGE',
            payload: {
              from: userId,
              ...data
            }
          }));
        }
      });
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error);
    }
  });
  
  ws.on('close', () => {
    activeUsers.delete(userId);
    console.log(`Пользователь отключился: ${userId}. Всего активных: ${activeUsers.size}`);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket ошибка:', error);
    activeUsers.delete(userId);
  });
});

// Обслуживание статических файлов для продакшена
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Coder-Pawno сервер запущен на порту ${PORT}`);
  console.log(`📢 Рекламная система активна`);
  console.log(`🔔 Пуш-уведомления готовы к работе`);
  console.log(`🌐 Откройте http://localhost:${PORT}`);
});
