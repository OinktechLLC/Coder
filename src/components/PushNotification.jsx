import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const PushNotification = ({ message, type = 'info' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#10b981" />;
      case 'error':
        return <AlertCircle size={20} color="#ef4444" />;
      default:
        return <Info size={20} color="#667eea" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#667eea';
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        background: '#252526',
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '12px',
        marginBottom: '12px',
        minWidth: '320px',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Bell size={20} color={getBorderColor()} />
      <span style={{ color: 'white', fontSize: '14px', flex: 1 }}>{message}</span>
    </motion.div>
  );
};

export default PushNotification;
