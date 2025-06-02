// Скрипт для принудительной загрузки стилей
(function() {
  // Функция для добавления временной метки к URL
  function addTimestamp(url) {
    return url + '?v=3.0.0&t=' + new Date().getTime();
  }

  // Функция для загрузки CSS файла
  function loadCSS(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = addTimestamp(url);
    document.head.appendChild(link);
    console.log('Загружен CSS: ' + url);
  }

  // Функция для добавления встроенных стилей
  function addInlineStyles() {
    var style = document.createElement('style');
    style.textContent = `
      /* Встроенные стили для мобильной версии - версия 3.0.0 */
      @media (max-width: 768px) {
        /* Мобильное меню */
        .mobile-menu-btn {
          background: linear-gradient(135deg, #4fd165, #36b14e) !important;
          color: white !important;
          border: 2px solid white !important;
          box-shadow: 0 0 15px rgba(79, 209, 101, 0.5) !important;
          transform: scale(1.1) !important;
          z-index: 9999 !important;
        }
        
        .mobile-menu-btn span,
        .mobile-menu-btn span::before,
        .mobile-menu-btn span::after {
          background: white !important;
          height: 3px !important;
        }
        
        /* Индикатор версии */
        body::after {
          content: "v3.0.0" !important;
          position: fixed !important;
          bottom: 10px !important;
          right: 10px !important;
          background: #4fd165 !important;
          color: white !important;
          padding: 5px 10px !important;
          border-radius: 20px !important;
          font-size: 12px !important;
          z-index: 9999 !important;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2) !important;
        }
      }
    `;
    document.head.appendChild(style);
    console.log('Добавлены встроенные стили');
  }

  // Функция для очистки кеша
  function clearCache() {
    // Пытаемся очистить кеш через Service Worker, если он поддерживается
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
      console.log('Service Worker кеш очищен');
    }
    
    // Пытаемся очистить кеш через Cache API, если он поддерживается
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
        }
      });
      console.log('Cache API кеш очищен');
    }
    
    console.log('Попытка очистки кеша завершена');
  }

  // Функция инициализации
  function init() {
    console.log('Запуск emergency-loader.js');
    
    // Очищаем кеш
    clearCache();
    
    // Загружаем CSS файлы
    loadCSS('./emergency-styles.css');
    loadCSS('./mobile-fixes.css');
    
    // Добавляем встроенные стили
    addInlineStyles();
    
    console.log('emergency-loader.js завершил работу');
  }

  // Запускаем инициализацию при загрузке страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
