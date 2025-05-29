import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css?v=1.0.5'
import './mobile-optimizations.css?v=1.5.0'
import { forceCacheRefresh, clearServiceWorkerCache, refreshResources } from './utils/cacheControl.js'

// Функция для принудительного обновления кеша
const clearCache = () => {
  // Очищаем кеш сервис-воркера
  clearServiceWorkerCache();
  
  // Обновляем ресурсы (CSS, JS)
  refreshResources();
  
  // Добавляем временную метку к URL
  forceCacheRefresh();
  
  // Добавляем случайное число к localStorage для отслеживания обновлений
  const cacheVersion = Date.now().toString();
  localStorage.setItem('cache_version', cacheVersion);
  localStorage.setItem('mobile_styles_version', cacheVersion);
  
  // Принудительно обновляем стили
  const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
  styleSheets.forEach(sheet => {
    const href = sheet.href.split('?')[0];
    sheet.href = `${href}?v=${cacheVersion}`;
  });
  
  console.log('Cache cleared and resources refreshed at:', new Date().toISOString());
}

// Вызываем функцию при загрузке страницы
window.addEventListener('load', clearCache);

// Также добавляем обработчик на видимость страницы
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Проверяем, нужно ли обновить кеш при возвращении на страницу
    const lastCacheUpdate = localStorage.getItem('cache_version');
    const now = Date.now();
    
    // Если прошло более 5 минут с последнего обновления кеша
    if (!lastCacheUpdate || (now - parseInt(lastCacheUpdate)) > 5 * 60 * 1000) {
      clearCache();
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
