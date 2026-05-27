import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const AdBanner = ({ config, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.title || 'Реклама', canvas.width / 2, canvas.height / 2);

    // Draw decorative elements
    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width - 50, canvas.height - 50, 40, 0, Math.PI * 2);
    ctx.stroke();
  }, [config]);

  const handleClick = () => {
    window.open(config.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden',
      cursor: 'pointer'
    }} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.3
        }}
      />
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'white',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {config.title}
        <span style={{
          marginLeft: '12px',
          padding: '4px 12px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          Реклама
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          transition: 'background 0.2s'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AdBanner;
