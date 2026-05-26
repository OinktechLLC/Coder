import { useState, useEffect } from 'react';

export const useWebSocket = () => {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('✅ WebSocket подключен');
      setConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Получено сообщение:', data);
        
        // Обработка разных типов сообщений
        switch (data.type) {
          case 'WELCOME':
            setUserId(data.payload.userId);
            if (window.appStore) {
              window.appStore.setActiveUsers(data.payload.activeUsers);
              window.appStore.addNotification({
                id: Date.now(),
                message: data.payload.message,
                type: 'success'
              });
            }
            break;
            
          case 'PUSH_NOTIFICATION':
            if (window.appStore) {
              window.appStore.addNotification(data.payload);
            }
            break;
            
          case 'USER_MESSAGE':
            console.log('Сообщение от пользователя:', data.payload);
            break;
            
          default:
            console.log('Неизвестный тип сообщения:', data.type);
        }
      } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
      }
    };

    websocket.onclose = () => {
      console.log('❌ WebSocket отключен');
      setConnected(false);
      
      // Попытка переподключения через 3 секунды
      setTimeout(() => {
        console.log('🔄 Попытка переподключения...');
      }, 3000);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };

    setWs(websocket);

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket не подключен');
    }
  };

  return { ws, connected, userId, sendMessage };
};
