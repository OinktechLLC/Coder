import { useState, useEffect } from 'react';

export const useAdBanner = () => {
  const [adConfig, setAdConfig] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);

  useEffect(() => {
    loadAdConfig();
    
    // Показываем баннер через 2 секунды после загрузки
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (canvasRef && adConfig) {
      renderAdOnCanvas();
    }
  }, [canvasRef, adConfig]);

  const loadAdConfig = async () => {
    try {
      const response = await fetch('/api/ad-config');
      const config = await response.json();
      setAdConfig(config);
    } catch (error) {
      console.error('Ошибка загрузки рекламы:', error);
    }
  };

  const renderAdOnCanvas = () => {
    if (!canvasRef || !adConfig) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры canvas
    canvas.width = window.innerWidth;
    canvas.height = 100; // Высота баннера

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Создаем градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(69, 69, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(128, 140, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(69, 69, 255, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем скриншот сайта (имитация)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(20, 10, 80, 80);
    
    // Добавляем текст рекламы
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(adConfig.title || 'Реклама', 120, 45);
    
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('Нажмите для перехода', 120, 70);

    // Анимация мерцания
    let opacity = 1;
    const animate = () => {
      opacity = opacity > 0.5 ? 0.5 : 1;
      ctx.globalAlpha = opacity;
      requestAnimationFrame(animate);
    };
    animate();
  };

  const handleAdClick = () => {
    if (adConfig && adConfig.linkUrl) {
      window.open(adConfig.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const closeAd = () => {
    setIsVisible(false);
    // Реклама всё равно останется в DOM для защиты от удаления
  };

  return {
    adConfig,
    isVisible,
    canvasRef,
    setCanvasRef,
    handleAdClick,
    closeAd
  };
};
