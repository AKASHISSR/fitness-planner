// Временный скрипт для отладки ошибок в личном кабинете
console.log('Запуск отладки личного кабинета');

// Проверяем, загружены ли все необходимые компоненты
const checkComponents = () => {
  const components = [
    'Card', 'CardGroup',
    'StatsCard', 'StatsCardGroup',
    'ProgressBar', 'CircularProgress',
    'Schedule', 'ShoppingList',
    'Reminder', 'ReminderGroup',
    'ResponsiveContainer'
  ];
  
  console.log('Проверка компонентов:');
  components.forEach(comp => {
    try {
      const exists = typeof window[comp] !== 'undefined' || 
                    document.querySelector(`[data-component="${comp}"]`);
      console.log(`${comp}: ${exists ? 'Загружен' : 'Не найден'}`);
    } catch (e) {
      console.log(`${comp}: Ошибка при проверке - ${e.message}`);
    }
  });
};

// Проверяем, загружены ли все необходимые стили
const checkStyles = () => {
  const styles = [
    'DashboardPage.css',
    'DashboardPage.theme.css',
    'Card.css',
    'StatsCard.css',
    'ProgressBar.css',
    'Schedule.css',
    'Reminder.css'
  ];
  
  console.log('Проверка стилей:');
  const loadedStyles = Array.from(document.styleSheets)
    .map(sheet => sheet.href ? sheet.href.split('/').pop() : '');
  
  styles.forEach(style => {
    const loaded = loadedStyles.some(s => s.includes(style));
    console.log(`${style}: ${loaded ? 'Загружен' : 'Не найден'}`);
  });
};

// Проверяем, правильно ли работает маршрутизация
const checkRouting = () => {
  console.log('Проверка маршрутизации:');
  console.log(`Текущий путь: ${window.location.pathname}`);
  console.log(`Параметры URL: ${window.location.search}`);
};

// Запускаем проверки при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM загружен, запускаем проверки...');
  checkComponents();
  checkStyles();
  checkRouting();
});

// Отслеживаем ошибки JavaScript
window.addEventListener('error', (event) => {
  console.error('Перехвачена ошибка JavaScript:', {
    message: event.message,
    source: event.filename,
    lineNumber: event.lineno,
    colNumber: event.colno,
    error: event.error
  });
});

console.log('Скрипт отладки загружен');
