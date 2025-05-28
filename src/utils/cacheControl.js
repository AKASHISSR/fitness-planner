/**
 * Утилита для принудительного обновления кеша
 * Добавляет временную метку к URL и перезагружает страницу
 */

export const forceCacheRefresh = () => {
  // Проверяем, была ли страница уже обновлена с временной меткой
  const hasTimestamp = window.location.search.includes('_t=');
  
  if (!hasTimestamp) {
    // Если нет временной метки, добавляем её и перезагружаем страницу
    const timestamp = Date.now();
    const separator = window.location.search ? '&' : '?';
    const newUrl = `${window.location.href}${separator}_t=${timestamp}`;
    
    // Используем replace вместо href для лучшей работы с историей браузера
    window.location.replace(newUrl);
  }
};

// Очистка кеша сервис-воркера, если он есть
export const clearServiceWorkerCache = () => {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log(`Cache ${cacheName} deleted`);
      });
    });
  }
};

// Функция для принудительного обновления ресурсов
export const refreshResources = () => {
  // Получаем все ссылки на стили
  const styleSheets = Array.from(document.styleSheets);
  
  // Для каждого стиля добавляем временную метку
  styleSheets.forEach(sheet => {
    if (sheet.href) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${sheet.href.split('?')[0]}?_t=${Date.now()}`;
      document.head.appendChild(link);
      
      // Удаляем старый стиль после загрузки нового
      link.onload = () => {
        const oldLink = document.querySelector(`link[href="${sheet.href}"]`);
        if (oldLink) {
          oldLink.remove();
        }
      };
    }
  });
};
