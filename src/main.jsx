import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css?v=1.0.3'

// Функция для принудительного обновления кеша
const clearCache = () => {
  // Очищаем кеш браузера, если доступен API
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Добавляем временную метку к URL для обхода кеша
  // Но только если в URL еще нет параметров
  if (window.location.search === '') {
    const timestamp = Date.now();
    const newUrl = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'v=' + timestamp;
    window.location.replace(newUrl);
  }
}

// Вызываем функцию при загрузке страницы
window.addEventListener('load', clearCache);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
