import React, { useRef } from 'react';
import { useAdBanner } from '../hooks/useAdBanner';

const AdBanner = () => {
  const { adConfig, isVisible, canvasRef, setCanvasRef, handleAdClick, closeAd } = useAdBanner();
  const bannerRef = useRef(null);

  if (!adConfig || !adConfig.enabled) {
    return null;
  }

  // Защита от удаления - баннер всегда в DOM
  return (
    <div
      ref={bannerRef}
      className={`ad-banner-protected transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: 'auto',
        display: 'block'
      }}
    >
      {/* Canvas для рендеринга рекламы */}
      <canvas
        ref={setCanvasRef}
        className="ad-banner-canvas w-full cursor-pointer"
        style={{ height: '100px' }}
        onClick={handleAdClick}
      />
      
      {/* Кнопка закрытия */}
      <button
        onClick={closeAd}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 z-10"
        aria-label="Закрыть рекламу"
      >
        ✕
      </button>
      
      {/* Ссылка на рекламный сайт */}
      {adConfig.linkUrl && (
        <a
          href={adConfig.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={handleAdClick}
        />
      )}
      
      {/* Текст рекламы (резервный вариант если canvas не загрузился) */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <div className="text-white">
          <h3 className="text-xl font-bold">{adConfig.title}</h3>
          <p className="text-sm opacity-70">Нажмите для перехода</p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
