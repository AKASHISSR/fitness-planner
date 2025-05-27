import React, { useState, useEffect } from 'react';
import './Toast.css';

/**
 * Компонент для отображения всплывающих уведомлений
 * @param {Object} props
 * @param {string} props.message - Текст уведомления
 * @param {string} props.type - Тип уведомления (success, error, warning, info)
 * @param {number} props.duration - Длительность отображения в мс (по умолчанию 3000)
 * @param {Function} props.onClose - Функция, вызываемая при закрытии уведомления
 * @returns {React.ReactElement}
 */
function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Задержка после анимации исчезновения
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  return (
    <div className={`toast toast-${type} ${visible ? 'visible' : 'hidden'}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Закрыть уведомление">✕</button>
    </div>
  );
}

/**
 * Контейнер для управления множественными уведомлениями
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  
  // Глобальная функция для добавления уведомлений
  window.showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };
  
  // Удаление уведомления по ID
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default Toast;
