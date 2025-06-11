import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, uploadUserAvatarToImgbb, getUserAvatar, logUserActivity } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import './DashboardPageV2-beautiful.css?v=3.0.0';
import { ADMINS } from '../App';

// Данные для планов питания и тренировок
const foodPlan = [
  { day: 'Понедельник', meals: [
    { type: 'Завтрак', text: 'Овсянка с ягодами и орехами' },
    { type: 'Обед', text: 'Куриная грудка, гречка, овощи' },
    { type: 'Ужин', text: 'Творог с фруктами' },
    { type: 'Перекус', text: 'Яблоко, миндаль' },
  ] },
  { day: 'Вторник', meals: [
    { type: 'Завтрак', text: 'Яичница, цельнозерновой хлеб' },
    { type: 'Обед', text: 'Рыба, картофель, салат' },
    { type: 'Ужин', text: 'Овощное рагу' },
    { type: 'Перекус', text: 'Греческий йогурт' },
  ] },
  { day: 'Среда', meals: [
    { type: 'Завтрак', text: 'Творожная запеканка с ягодами' },
    { type: 'Обед', text: 'Индейка, киноа, овощи' },
    { type: 'Ужин', text: 'Омлет с овощами' },
    { type: 'Перекус', text: 'Банан, орехи' },
  ] },
  { day: 'Четверг', meals: [
    { type: 'Завтрак', text: 'Смузи с протеином и фруктами' },
    { type: 'Обед', text: 'Говядина, бурый рис, овощи' },
    { type: 'Ужин', text: 'Рыбный салат' },
    { type: 'Перекус', text: 'Протеиновый батончик' },
  ] },
  { day: 'Пятница', meals: [
    { type: 'Завтрак', text: 'Гречневая каша с яйцом' },
    { type: 'Обед', text: 'Куриный суп, хлеб' },
    { type: 'Ужин', text: 'Тушеные овощи с тофу' },
    { type: 'Перекус', text: 'Творог с медом' },
  ] },
  { day: 'Суббота', meals: [
    { type: 'Завтрак', text: 'Овсяноблин с творогом и ягодами' },
    { type: 'Обед', text: 'Паста с морепродуктами' },
    { type: 'Ужин', text: 'Куриный салат' },
    { type: 'Перекус', text: 'Фруктовый салат' },
  ] },
  { day: 'Воскресенье', meals: [
    { type: 'Завтрак', text: 'Блины с творогом' },
    { type: 'Обед', text: 'Запеченная курица с овощами' },
    { type: 'Ужин', text: 'Творог с фруктами' },
    { type: 'Перекус', text: 'Орехи, сухофрукты' },
  ] },
];

const shoppingList = [
  'Овсянка', 'Ягоды', 'Орехи', 'Куриная грудка', 'Гречка', 'Овощи',
  'Творог', 'Фрукты', 'Яблоко', 'Миндаль', 'Яйца', 'Хлеб', 'Рыба', 
  'Картофель', 'Салат', 'Йогурт', 'Индейка', 'Киноа', 'Банан', 
  'Протеин', 'Говядина', 'Бурый рис', 'Протеиновый батончик', 
  'Мед', 'Тофу', 'Паста', 'Морепродукты', 'Блины', 'Сухофрукты'
];

const workoutPlan = [
  { day: 'Понедельник', workout: 'Силовая: приседания 3x15, отжимания 3x12, планка 3x60 сек' },
  { day: 'Вторник', workout: 'Кардио: бег 30 мин, скакалка 10 мин, велотренажер 15 мин' },
  { day: 'Среда', workout: 'Отдых или йога для восстановления 30 мин' },
  { day: 'Четверг', workout: 'Силовая: выпады 3x12, подтягивания 3x8, пресс 3x20' },
  { day: 'Пятница', workout: 'Кардио: велотренажёр 20 мин, прыжки 10 мин, эллипс 15 мин' },
  { day: 'Суббота', workout: 'Функционалка: бурпи 3x10, выпрыгивания 3x15, планка боковая 3x30 сек' },
  { day: 'Воскресенье', workout: 'Отдых и восстановление' },
];

// Компонент для анимированного фона
const AnimatedBackground = () => {
  return (
    <div className="dashboard-bg">
      {[...Array(15)].map((_, index) => (
        <motion.div
          key={index}
          className="dashboard-particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 80 + 40}px`,
            height: `${Math.random() * 80 + 40}px`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Функция для экспорта текста в PDF
function exportTextToPDF(text, filename = 'plan.pdf') {
  console.log('Экспорт в PDF:', filename);
  alert('Функция экспорта будет добавлена позже');
}

// Форматирование даты
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('ru-RU');
}

// Получение иконки для типа активности
function getActivityIcon(type) {
  const icons = {
    login: '🔐',
    purchase: '💳',
    survey: '📝',
    profile_update: '👤',
    plan_view: '📖'
  };
  return icons[type] || '📊';
}

// Главный компонент личного кабинета
function DashboardPageV2() {
  // Состояния
  const [tab, setTab] = useState('food');
  const [paidType, setPaidType] = useState(null);
  const [mealPlan, setMealPlan] = useState('');
  const [workoutPlanText, setWorkoutPlanText] = useState('');
  const [user, setUser] = useState({ email: '', name: '' });
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState('');
  const [loadingName, setLoadingName] = useState(false);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const navigate = useNavigate();

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    setPaidType(localStorage.getItem('fitgenius_paid_type'));
    setMealPlan(localStorage.getItem('fitgenius_meal_plan') || '');
    setWorkoutPlanText(localStorage.getItem('fitgenius_workout_plan') || '');
    
    // Получаем данные пользователя из localStorage
    let userEmail = '';
    let userData = localStorage.getItem('fitgenius_user');
    
    console.log('Полученные данные пользователя из localStorage:', userData);
    
    if (userData) {
      try {
        // Проверяем, если это JSON строка
        if (userData.startsWith('{')) {
          const parsedData = JSON.parse(userData);
          if (parsedData.email) {
            userEmail = parsedData.email;
          }
        } else if (userData.includes('@')) {
          // Просто email строка
          userEmail = userData;
        }
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
        // Если не можем распарсить, используем как есть
        userEmail = userData;
      }
    }
    
    console.log('Очищенный email пользователя:', userEmail);
    const cleanEmail = userEmail;
    
    // Загружаем имя из Firestore
    async function fetchName() {
      let name = localStorage.getItem('fitgenius_name') || 'Пользователь';
      if (cleanEmail) {
        setLoadingName(true);
        try {
          const docRef = doc(db, 'users', cleanEmail);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().name) {
            name = snap.data().name;
            localStorage.setItem('fitgenius_name', name);
          }
        } catch (error) {
          console.error('Ошибка при загрузке имени:', error);
        }
        setLoadingName(false);
      }
      setUser({ email: cleanEmail, name });
      setNewName(name);
    }
    
    // Загружаем историю активности
    async function fetchActivity() {
      if (!cleanEmail) return;
      setLoadingActivity(true);
      try {
        const activityQuery = query(
          collection(db, 'user_activity'),
          where('email', '==', cleanEmail),
          orderBy('timestamp', 'desc')
        );
        const snap = await getDocs(activityQuery);
        setActivity(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Ошибка при загрузке активности:', error);
      }
      setLoadingActivity(false);
    }
    
    // Загружаем аватар
    async function fetchAvatar() {
      if (!cleanEmail) return;
      setLoadingAvatar(true);
      setAvatarError('');
      try {
        console.log('Загрузка аватара для:', cleanEmail);
        const url = await getUserAvatar(cleanEmail);
        console.log('Полученный URL аватара:', url);
        if (url) setAvatarUrl(url);
      } catch (error) {
        console.error('Ошибка загрузки аватара:', error);
        setAvatarError('Ошибка загрузки аватара');
      }
      setLoadingAvatar(false);
    }
    
    // Инициализация состояния чекбоксов для списка покупок
    const savedCheckedItems = localStorage.getItem('fitgenius_shopping_list');
    if (savedCheckedItems) {
      try {
        setCheckedItems(JSON.parse(savedCheckedItems));
      } catch (error) {
        console.error('Ошибка при загрузке списка покупок:', error);
        setCheckedItems({});
      }
    }
    
    fetchName();
    fetchActivity();
    fetchAvatar();
    
    // Логируем вход в личный кабинет
    if (cleanEmail) {
      logUserActivity({
        email: cleanEmail,
        type: 'login',
        desc: 'Вход в личный кабинет'
      });
    }
  }, []);
  
  // Сохранение имени пользователя
  const handleNameSave = async () => {
    if (!newName.trim() || !user.email) return;
    
    setLoadingName(true);
    try {
      await setDoc(doc(db, 'users', user.email), { 
        name: newName.trim(),
        email: user.email 
      }, { merge: true });
      
      localStorage.setItem('fitgenius_name', newName.trim());
      setUser(prev => ({ ...prev, name: newName.trim() }));
      setEditName(false);
      
      // Логируем активность
      await logUserActivity(user.email, 'profile_update', `Изменено имя на: ${newName.trim()}`);
    } catch (error) {
      console.error('Ошибка сохранения имени:', error);
      alert('Ошибка при сохранении имени');
    }
    setLoadingName(false);
  };
  
  // Обработка изменения аватара
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user.email) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Размер файла не должен превышать 5MB');
      return;
    }
    
    setLoadingAvatar(true);
    setAvatarError('');
    
    try {
      console.log('Загрузка аватара для пользователя:', user.email);
      const imageUrl = await uploadUserAvatarToImgbb(file, user.email);
      console.log('Полученный URL аватара:', imageUrl);
      setAvatarUrl(imageUrl);
      
      // Логируем активность
      await logUserActivity(user.email, 'profile_update', 'Обновлен аватар');
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      setAvatarError('Ошибка при загрузке изображения');
    }
    
    setLoadingAvatar(false);
  };
  
  // Переключение состояния чекбокса в списке покупок
  const toggleCheckbox = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
    localStorage.setItem('fitgenius_shopping_list', JSON.stringify(checkedItems));
  };
  
  // Экспорт плана в PDF
  const handleExport = () => {
    const text = tab === 'food' ? mealPlan : workoutPlanText;
    exportTextToPDF(text, `${tab}_plan.pdf`);
  };
  
  // Проверка доступа к планам
  const isFoodPaid = paidType === 'food' || paidType === 'combo';
  const isWorkoutPaid = paidType === 'workout' || paidType === 'combo';
  
  // Проверка администратора
  const checkAdmin = () => {
    if (!user.email) return false;
    
    // Проверяем каждый email админа
    for (const adminEmail of ADMINS) {
      if (user.email.toLowerCase() === adminEmail.toLowerCase()) {
        return true;
      }
    }
    
    return false;
  };
  
  const isAdmin = checkAdmin();
  console.log('Проверка админа:', user.email, ADMINS, isAdmin);
  
  // Переход в админ-панель
  const goToAdmin = () => {
    navigate('/admin');
  };
  
  // Выход из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('fitgenius_user');
    localStorage.removeItem('fitgenius_name');
    localStorage.removeItem('fitgenius_paid_type');
    localStorage.removeItem('fitgenius_meal_plan');
    localStorage.removeItem('fitgenius_workout_plan');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <AnimatedBackground />
      
      <motion.div 
        className="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Профиль пользователя */}
        <div className="user-profile">
          <div className="profile-decoration"></div>
          <div className="profile-decoration"></div>
          
          <div className="avatar-container">
            <div className="avatar-wrapper">
              {loadingAvatar ? (
                <div className="avatar-placeholder">⏳</div>
              ) : (
                <div className="avatar-image-container">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Аватар" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                  )}
                  
                  <div className="avatar-overlay">
                    <label htmlFor="avatar-upload" className="avatar-edit-overlay">
                      <span className="avatar-edit-text">Изменить фото</span>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                        disabled={loadingAvatar}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            {avatarError && (
              <div style={{ color: '#ff6b6b', marginTop: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                {avatarError}
              </div>
            )}
          </div>
          
          <div className="user-info">
            {editName ? (
              <div className="name-edit-form">
                <input
                  type="text"
                  className="name-input"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  maxLength={32}
                  disabled={loadingName}
                  placeholder="Ваше имя"
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleNameSave} 
                  disabled={loadingName || !newName.trim()}
                >
                  Сохранить
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditName(false);
                    setNewName(user.name);
                  }} 
                  disabled={loadingName}
                >
                  Отмена
                </button>
              </div>
            ) : (
              <div className="user-name">
                {user.name}
                <button 
                  className="edit-name-btn"
                  onClick={() => setEditName(true)}
                  title="Редактировать имя"
                >
                  ✏️
                </button>
                {loadingName && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>⏳</span>}
              </div>
            )}
            
            <div className="user-email">{user.email || 'Гостевой доступ'}</div>
            
            <div className="user-actions">
              {isAdmin && (
                <button className="btn btn-admin" onClick={goToAdmin}>
                  <span>👑</span> Админ-панель
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleLogout}>
                <span>🚪</span> Выйти
              </button>
            </div>
          </div>
        </div>
        
        {/* Вкладки */}
        <div className="tabs-container">
          <div 
            className={`tab ${tab === 'food' ? 'active' : ''}`}
            onClick={() => setTab('food')}
          >
            🍽️ План питания
          </div>
          <div 
            className={`tab ${tab === 'workout' ? 'active' : ''}`}
            onClick={() => setTab('workout')}
          >
            💪 План тренировок
          </div>
          <div 
            className={`tab ${tab === 'shopping' ? 'active' : ''}`}
            onClick={() => setTab('shopping')}
          >
            🛒 Список покупок
          </div>
          <div 
            className={`tab ${tab === 'activity' ? 'active' : ''}`}
            onClick={() => setTab('activity')}
          >
            📊 Активность
          </div>
        </div>
        
        {/* Содержимое вкладок */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={tab}
            className="tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* План питания */}
            {tab === 'food' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2>🍽️ План питания</h2>
                  {isFoodPaid && mealPlan && (
                    <button className="btn btn-primary" onClick={handleExport}>
                      <span>📥</span> Экспорт в PDF
                    </button>
                  )}
                </div>
                
                {isFoodPaid ? (
                  mealPlan ? (
                    <div className="content-card">
                      <pre style={{ 
                        whiteSpace: 'pre-wrap', 
                        fontFamily: 'inherit',
                        lineHeight: '1.6',
                        fontSize: '1rem',
                        color: '#374151'
                      }}>
                        {mealPlan}
                      </pre>
                    </div>
                  ) : (
                    <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                      <h3 style={{ marginBottom: '1rem', color: '#4fd165' }}>Ваш план питания готовится!</h3>
                      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Мы составляем персональную программу питания на основе ваших ответов в анкете. 
                        Обычно это занимает несколько часов.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                    <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>План питания не доступен</h3>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
                      Для получения персонального плана питания необходимо приобрести соответствующий тариф.
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/choose')}
                      style={{ fontSize: '1.1rem', padding: '14px 28px' }}
                    >
                      <span>🛒</span> Выбрать тариф
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* План тренировок */}
            {tab === 'workout' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2>💪 План тренировок</h2>
                  {isWorkoutPaid && workoutPlanText && (
                    <button className="btn btn-primary" onClick={handleExport}>
                      <span>📥</span> Экспорт в PDF
                    </button>
                  )}
                </div>
                
                {isWorkoutPaid ? (
                  workoutPlanText ? (
                    <div className="content-card">
                      <pre style={{ 
                        whiteSpace: 'pre-wrap', 
                        fontFamily: 'inherit',
                        lineHeight: '1.6',
                        fontSize: '1rem',
                        color: '#374151'
                      }}>
                        {workoutPlanText}
                      </pre>
                    </div>
                  ) : (
                    <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💪</div>
                      <h3 style={{ marginBottom: '1rem', color: '#4fd165' }}>Ваш план тренировок готовится!</h3>
                      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Мы составляем персональную программу тренировок на основе ваших целей и физической подготовки. 
                        Обычно это занимает несколько часов.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                    <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>План тренировок не доступен</h3>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
                      Для получения персонального плана тренировок необходимо приобрести соответствующий тариф.
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/choose')}
                      style={{ fontSize: '1.1rem', padding: '14px 28px' }}
                    >
                      <span>🛒</span> Выбрать тариф
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* Список покупок */}
            {tab === 'shopping' && (
              <>
                <h2>🛒 Список покупок</h2>
                <div className="content-card">
                  <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                    Отмечайте продукты по мере покупки для удобного планирования.
                  </p>
                  <div className="shopping-list">
                    {shoppingList.map((item, index) => (
                      <motion.div
                        key={item}
                        className={`shopping-item ${checkedItems[item] ? 'checked' : ''}`}
                        onClick={() => toggleCheckbox(item)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`shopping-checkbox ${checkedItems[item] ? 'checked' : ''}`}>
                          {checkedItems[item] && <span>✓</span>}
                        </div>
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* История активности */}
            {tab === 'activity' && (
              <>
                <h2>📊 История активности</h2>
                {loadingActivity ? (
                  <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Загружаем историю активности...</p>
                  </div>
                ) : activity.length > 0 ? (
                  <div className="activity-list">
                    {activity.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        className="activity-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="activity-icon">
                          {getActivityIcon(item.type)}
                        </div>
                        <div className="activity-details">
                          <div className="activity-date">
                            {formatDate(item.timestamp)}
                          </div>
                          <div className="activity-action">
                            {item.type === 'login' && 'Вход в систему'}
                            {item.type === 'purchase' && 'Покупка'}
                            {item.type === 'survey' && 'Заполнение анкеты'}
                            {item.type === 'profile_update' && 'Обновление профиля'}
                            {item.type === 'plan_view' && 'Просмотр плана'}
                            {!['login', 'purchase', 'survey', 'profile_update', 'plan_view'].includes(item.type) && item.desc}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                    <h3 style={{ marginBottom: '1rem', color: '#64748b' }}>История активности пуста</h3>
                    <p style={{ color: '#64748b' }}>
                      Здесь будет отображаться ваша активность на сайте: входы, покупки, обновления профиля.
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default DashboardPageV2;
