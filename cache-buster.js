// Принудительная очистка кеша браузера
(function() {
  'use strict';
  
  const CACHE_VERSION = '20241220-057';
  const STORAGE_KEY = 'fitgenius_cache_version';
  
  // Проверяем версию кеша
  const currentVersion = localStorage.getItem(STORAGE_KEY);
  
  if (currentVersion !== CACHE_VERSION) {
    console.log('🔄 Обновление кеша FitGenius...');
    
    // Очищаем все виды кеша
    try {
      // Service Worker кеш
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
      }
      
      // Application Cache (устаревший, но на всякий случай)
      if (window.applicationCache) {
        window.applicationCache.update();
      }
      
      // Очищаем localStorage (кроме пользовательских данных)
      const userEmail = localStorage.getItem('fitgenius_user');
      const userName = localStorage.getItem('fitgenius_name');
      const userPaidType = localStorage.getItem('fitgenius_paid_type');
      const userMealPlan = localStorage.getItem('fitgenius_meal_plan');
      const userWorkoutPlan = localStorage.getItem('fitgenius_workout_plan');
      const userTheme = localStorage.getItem('fitgenius_theme');
      
      localStorage.clear();
      
      // Восстанавливаем пользовательские данные
      if (userEmail) localStorage.setItem('fitgenius_user', userEmail);
      if (userName) localStorage.setItem('fitgenius_name', userName);
      if (userPaidType) localStorage.setItem('fitgenius_paid_type', userPaidType);
      if (userMealPlan) localStorage.setItem('fitgenius_meal_plan', userMealPlan);
      if (userWorkoutPlan) localStorage.setItem('fitgenius_workout_plan', userWorkoutPlan);
      if (userTheme) localStorage.setItem('fitgenius_theme', userTheme);
      
      // Устанавливаем новую версию кеша
      localStorage.setItem(STORAGE_KEY, CACHE_VERSION);
      
      console.log('✅ Кеш FitGenius обновлен до версии', CACHE_VERSION);
      
    } catch (error) {
      console.warn('⚠️ Ошибка при очистке кеша:', error);
    }
  }
  
  // Принудительное обновление CSS
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
  cssLinks.forEach(link => {
    if (link.href.includes('fitgenius') || link.href.includes('fitness-planner')) {
      const url = new URL(link.href);
      url.searchParams.set('v', CACHE_VERSION);
      link.href = url.toString();
    }
  });
  
  // Дополнительная принудительная очистка кеша
  if (currentVersion !== CACHE_VERSION) {
    // Очищаем кеш браузера
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
    
    // Принудительная перезагрузка через 1 секунду
    setTimeout(() => {
      if (currentVersion && currentVersion !== CACHE_VERSION) {
        console.log('🔄 Принудительная перезагрузка для применения обновлений...');
        window.location.reload(true);
      }
    }, 1000);
  }
  
})(); 