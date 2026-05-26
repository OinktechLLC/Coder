import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Состояние пользователя
  user: null,
  isAuthenticated: false,
  agreedToTerms: false,
  
  // Состояние редактора
  currentFile: null,
  files: [],
  projectPath: null,
  language: 'pawno',
  code: '',
  
  // Состояние компиляции
  isCompiling: false,
  compilationResult: null,
  
  // Уведомления
  notifications: [],
  activeUsers: 0,
  
  // Реклама (защищенное состояние - нельзя изменить с клиента)
  adConfig: {
    enabled: true,
    imageUrl: '',
    linkUrl: '',
    title: ''
  },
  
  // Аудио эффекты
  soundEnabled: true,
  
  // Действия для аутентификации
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }),
  
  // Действия для редактора
  setCurrentFile: (file) => set({ currentFile: file }),
  setFiles: (files) => set({ files }),
  setProjectPath: (path) => set({ projectPath: path }),
  setLanguage: (lang) => set({ language: lang }),
  setCode: (code) => set({ code }),
  
  // Загрузка проекта
  loadProject: async (files) => {
    set({ files, projectPath: 'loaded_project' });
  },
  
  // Скачивание проекта
  downloadProject: () => {
    const { files } = get();
    // Логика скачивания будет в компоненте
    return files;
  },
  
  // Действия для компиляции
  setIsCompiling: (isCompiling) => set({ isCompiling }),
  setCompilationResult: (result) => set({ compilationResult: result }),
  
  // Компиляция кода
  compileCode: async (code, language = 'pawno') => {
    set({ isCompiling: true });
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const result = await response.json();
      set({ compilationResult: result, isCompiling: false });
      return result;
    } catch (error) {
      set({ 
        compilationResult: { success: false, error: error.message },
        isCompiling: false 
      });
      throw error;
    }
  },
  
  // Действия для уведомлений
  addNotification: (notification) => {
    const { notifications } = get();
    set({ notifications: [...notifications, notification] });
    
    // Автовоспроизведение звука
    if (get().soundEnabled) {
      playNotificationSound();
    }
    
    // Удаление уведомления через 5 секунд
    setTimeout(() => {
      const current = get().notifications;
      set({ 
        notifications: current.filter(n => n.id !== notification.id) 
      });
    }, 5000);
  },
  
  removeNotification: (id) => {
    const { notifications } = get();
    set({ notifications: notifications.filter(n => n.id !== id) });
  },
  
  setActiveUsers: (count) => set({ activeUsers: count }),
  
  // Действия для рекламы (только чтение с сервера)
  loadAdConfig: async () => {
    try {
      const response = await fetch('/api/ad-config');
      const config = await response.json();
      set({ adConfig: config });
      return config;
    } catch (error) {
      console.error('Ошибка загрузки рекламы:', error);
      return null;
    }
  },
  
  // Действия для звука
  toggleSound: () => {
    const { soundEnabled } = get();
    set({ soundEnabled: !soundEnabled });
  }
}));

// Функция воспроизведения звука уведомления
function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Ошибка воспроизведения звука:', error);
  }
}
