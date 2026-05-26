import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

const NotificationSystem = () => {
  const { notifications, removeNotification, soundEnabled } = useAppStore();

  useEffect(() => {
    // Запрос разрешения на браузерные уведомления
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Показ браузерных уведомлений
    if (notifications.length > 0 && 'Notification' in window) {
      const latestNotification = notifications[notifications.length - 1];
      
      if (Notification.permission === 'granted') {
        new Notification('Coder-Pawno', {
          body: latestNotification.message,
          icon: '/vite.svg',
          badge: '/vite.svg'
        });
      }
    }
  }, [notifications]);

  return null; // Уведомления отображаются через Toaster
};

export default NotificationSystem;
