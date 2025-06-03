import { useEffect, useState } from 'react';
import './LoadingScreen.css';

function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Симулируем загрузку с прогресс-баром
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Небольшая задержка перед скрытием
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              onLoadingComplete();
            }, 500); // Время анимации исчезновения
          }, 300);
          return 100;
        }
        // Ускоряем загрузку к концу
        const increment = prev < 70 ? Math.random() * 15 + 5 : Math.random() * 25 + 10;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`loading-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="loading-content">
        {/* Логотип с анимацией */}
        <div className="loading-logo">
          <div className="logo-icon-loading">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" 
                stroke="currentColor" 
                strokeWidth="1.5"
                className="logo-circle"
              />
              <path 
                d="M15 8.5C15 8.5 13.5 9.5 12 9.5C10.5 9.5 9 8.5 9 8.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                className="logo-smile-top"
              />
              <path 
                d="M8.5 14C8.5 14 9.5 16 12 16C14.5 16 15.5 14 15.5 14" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                className="logo-smile-bottom"
              />
              <path 
                d="M8.5 12H15.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                className="logo-line"
              />
            </svg>
          </div>
          <div className="logo-text-loading">
            <span className="logo-fit-loading">Fit</span>
            <span className="logo-genius-loading">Genius</span>
          </div>
        </div>

        {/* Текст загрузки */}
        <div className="loading-text">
          <h2>Загружаем ваш фитнес-помощник...</h2>
          <p>Подготавливаем персональные программы</p>
        </div>

        {/* Прогресс-бар */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        {/* Анимированные точки */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      {/* Фоновая анимация */}
      <div className="loading-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
    </div>
  );
}

export default LoadingScreen; 