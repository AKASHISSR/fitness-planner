import React from 'react';
import { useEffect, useState } from 'react';

/**
 * Адаптивный контейнер, который автоматически определяет размер экрана
 * и применяет соответствующие стили и компоненты
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Содержимое контейнера
 * @param {React.ReactNode} props.mobileContent - Содержимое для мобильных устройств (опционально)
 * @param {React.ReactNode} props.desktopContent - Содержимое для десктопа (опционально)
 * @param {string} props.className - Дополнительные классы CSS
 * @param {Object} props.style - Дополнительные inline стили
 * @returns {React.ReactElement}
 */
function ResponsiveContainer({ 
  children, 
  mobileContent, 
  desktopContent, 
  className = '', 
  style = {}
}) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Функция для определения типа устройства
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Проверяем при загрузке
    checkDevice();
    
    // Слушаем изменения размера окна
    window.addEventListener('resize', checkDevice);
    
    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // Определяем содержимое в зависимости от устройства
  const content = isMobile && mobileContent ? mobileContent : 
                 !isMobile && desktopContent ? desktopContent : 
                 children;
  
  return (
    <div 
      className={`responsive-container ${isMobile ? 'mobile' : 'desktop'} ${className}`}
      style={{
        width: '100%',
        maxWidth: isMobile ? '100%' : '1200px',
        margin: '0 auto',
        padding: isMobile ? '0 12px' : '0 24px',
        ...style
      }}
    >
      {content}
    </div>
  );
}

export default ResponsiveContainer;
