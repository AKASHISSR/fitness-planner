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
