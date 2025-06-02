// force-refresh.js - Скрипт для принудительного обновления стилей
(function() {
  // Генерируем уникальную метку времени
  const timestamp = Date.now();
  
  // Функция для принудительного обновления стилей
  function forceStyleRefresh() {
    // Получаем все таблицы стилей
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    // Обновляем каждую таблицу стилей с новой меткой времени
    styleSheets.forEach(styleSheet => {
      const originalHref = styleSheet.getAttribute('href').split('?')[0];
      styleSheet.setAttribute('href', `${originalHref}?v=${timestamp}`);
    });
    
    // Добавляем встроенные стили для мобильной оптимизации
    const inlineStyles = document.createElement('style');
    inlineStyles.textContent = `
      /* Принудительная мобильная оптимизация */
      @media (max-width: 768px) {
        /* Мобильное меню */
        .mobile-menu {
          width: 85% !important;
          max-width: 320px !important;
        }
        
        .mobile-menu-btn {
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
        }
        
        .mobile-menu-close-btn {
          display: none !important;
        }
        
        .mobile-menu-phone-display {
          border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
          margin-top: 10px !important;
          padding-top: 10px !important;
        }
        
        /* Личный кабинет */
        .dashboard-container {
          padding: 1rem !important;
        }
        
        .dashboard-content {
          padding: 1.5rem !important;
        }
        
        .user-profile {
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
        }
        
        .user-avatar-container {
          margin-right: 0 !important;
          margin-bottom: 15px !important;
        }
        
        /* Страница опросника */
        .questionnaire-center {
          padding: 25px 20px !important;
        }
        
        /* Страница оплаты */
        .pay-card {
          max-width: 100% !important;
        }
        
        .pay-tariff {
          flex-direction: column !important;
          text-align: center !important;
        }
        
        .pay-tariff-icon {
          margin-right: 0 !important;
          margin-bottom: 1rem !important;
        }
        
        .pay-total {
          flex-direction: column !important;
          text-align: center !important;
        }
        
        /* Страница FAQ */
        .faq-container {
          padding: 25px 20px !important;
        }
        
        /* Страница отзывов */
        .review-card {
          padding: 15px !important;
        }
      }
    `;
    document.head.appendChild(inlineStyles);
    
    console.log('Styles forcefully refreshed at:', new Date().toISOString());
  }
  
  // Выполняем обновление стилей при загрузке страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceStyleRefresh);
  } else {
    forceStyleRefresh();
  }
  
  // Также обновляем стили при полной загрузке страницы
  window.addEventListener('load', forceStyleRefresh);
  
  // Сохраняем версию в localStorage
  try {
    localStorage.setItem('force_refresh_version', timestamp.toString());
  } catch (e) {
    console.error('LocalStorage not available:', e);
  }
})();

// Force refresh script
(function() {
  const version = '1.5.0';
  const lastVersion = localStorage.getItem('app_version');
  
  if (lastVersion !== version) {
    localStorage.setItem('app_version', version);
    window.location.reload(true);
  }
})();
