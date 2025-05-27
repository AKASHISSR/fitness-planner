import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, uploadUserAvatarToImgbb, getUserAvatar, logUserActivity } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import './DashboardPageV2.css';
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
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          className="dashboard-particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
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
  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<pre style="font-family:inherit;font-size:16px;white-space:pre-wrap;">' + text + '</pre>');
  win.document.close();
  win.print();
}

// Форматирование даты
function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return 'Неизвестно';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Получение иконки для типа активности
function getActivityIcon(type) {
  switch (type) {
    case 'login': return '🔐';
    case 'purchase': return '💰';
    case 'survey': return '📝';
    case 'profile_update': return '👤';
    case 'plan_view': return '📊';
    default: return '📌';
  }
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
    if (!newName.trim()) return;
    
    setLoadingName(true);
    localStorage.setItem('fitgenius_name', newName);
    setUser(u => ({ ...u, name: newName }));
    setEditName(false);
    
    // Сохраняем имя в Firestore
    if (user.email) {
      try {
        await setDoc(doc(db, 'users', user.email), { name: newName }, { merge: true });
        
        // Логируем изменение профиля
        await logUserActivity({
          email: user.email,
          type: 'profile_update',
          desc: 'Обновление имени пользователя'
        });
      } catch (error) {
        console.error('Ошибка при сохранении имени:', error);
      }
    }
    setLoadingName(false);
  };
  
  // Обработка изменения аватара
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setAvatarError('Можно загружать только изображения');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Размер файла не должен превышать 2 МБ');
      return;
    }
    
    setLoadingAvatar(true);
    setAvatarError('');
    
    try {
      console.log('Загрузка аватара для пользователя:', user.email);
      const url = await uploadUserAvatarToImgbb(user.email, file);
      console.log('Полученный URL аватара:', url);
      setAvatarUrl(url);
      
      // Логируем обновление аватара
      await logUserActivity({
        email: user.email,
        type: 'profile_update',
        desc: 'Обновление аватара пользователя'
      });
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      setAvatarError('Ошибка загрузки аватара. Пожалуйста, попробуйте еще раз.');
    }
    
    setLoadingAvatar(false);
  };
  
  // Переключение состояния чекбокса в списке покупок
  const toggleCheckbox = (item) => {
    const newCheckedItems = { ...checkedItems, [item]: !checkedItems[item] };
    setCheckedItems(newCheckedItems);
    localStorage.setItem('fitgenius_shopping_list', JSON.stringify(newCheckedItems));
  };
  
  // Экспорт плана в PDF
  const handleExport = () => {
    if (tab === 'food' && mealPlan) {
      exportTextToPDF(mealPlan, 'meal-plan.pdf');
    } else if (tab === 'workout' && workoutPlanText) {
      exportTextToPDF(workoutPlanText, 'workout-plan.pdf');
    }
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
    navigate('/adminV2');
  };
  
  // Выход из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('fitgenius_user');
    localStorage.removeItem('fitgenius_name');
    localStorage.removeItem('fitgenius_paid_type');
    window.location.href = '/';
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
                <div className="avatar-spinner">⏳</div>
              ) : (
                <>
                  <div className="avatar-image-container">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Аватар" className="avatar-image" />
                    ) : (
                      <div className="avatar-placeholder">👤</div>
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
                </>
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
                  className="name-save-btn"
                  onClick={handleNameSave} 
                  disabled={loadingName || !newName.trim()}
                >
                  Сохранить
                </button>
                <button 
                  className="name-cancel-btn"
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
                {loadingName && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Сохранение...</span>}
              </div>
            )}
            
            <div className="user-email">{user.email ? user.email : '—'}</div>
            
            <div className="user-actions">
              {isAdmin && (
                <button 
                  className="btn btn-admin" 
                  onClick={goToAdmin}
                  style={{
                    background: '#ff9800',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 152, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 152, 0, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>👑</span> Админ-панель
                </button>
              )}
              <button className="btn btn-logout" onClick={handleLogout}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2>План питания</h2>
                  {isFoodPaid && mealPlan && (
                    <button className="btn btn-primary" onClick={handleExport}>
                      <span>📥</span> Экспорт в PDF
                    </button>
                  )}
                </div>
                
                {isFoodPaid ? (
                  <div className="meal-plan">
                    {foodPlan.map((day, index) => (
                      <motion.div 
                        key={day.day}
                        className="day-card fade-in"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="day-header">{day.day}</div>
                        <div className="day-content">
                          {day.meals.map((meal, i) => (
                            <div key={i} className="meal-item">
                              <div className="meal-type">{meal.type}</div>
                              <div className="meal-text">{meal.text}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#666' }}>
                      Для доступа к плану питания необходимо приобрести подписку
                    </h3>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/pricing')}
                      style={{ margin: '0 auto' }}
                    >
                      Перейти к тарифам
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* План тренировок */}
            {tab === 'workout' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2>План тренировок</h2>
                  {isWorkoutPaid && workoutPlanText && (
                    <button className="btn btn-primary" onClick={handleExport}>
                      <span>📥</span> Экспорт в PDF
                    </button>
                  )}
                </div>
                
                {isWorkoutPaid ? (
                  <div className="workout-plan">
                    {workoutPlan.map((day, index) => (
                      <motion.div 
                        key={day.day}
                        className="workout-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="workout-header">{day.day}</div>
                        <div className="workout-content">
                          <div className="workout-text">{day.workout}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#666' }}>
                      Для доступа к плану тренировок необходимо приобрести подписку
                    </h3>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/pricing')}
                      style={{ margin: '0 auto' }}
                    >
                      Перейти к тарифам
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* Список покупок */}
            {tab === 'shopping' && (
              <>
                <h2>Список покупок</h2>
                
                {isFoodPaid ? (
                  <div className="shopping-list">
                    <div className="shopping-items">
                      {shoppingList.map((item, index) => (
                        <motion.div 
                          key={item}
                          className="shopping-item"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                        >
                          <div 
                            className={`shopping-item-checkbox ${checkedItems[item] ? 'checked' : ''}`}
                            onClick={() => toggleCheckbox(item)}
                          >
                            {checkedItems[item] && '✓'}
                          </div>
                          <div 
                            className={`shopping-item-text ${checkedItems[item] ? 'checked' : ''}`}
                            onClick={() => toggleCheckbox(item)}
                          >
                            {item}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#666' }}>
                      Для доступа к списку покупок необходимо приобрести подписку на план питания
                    </h3>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/pricing')}
                      style={{ margin: '0 auto' }}
                    >
                      Перейти к тарифам
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* История активности */}
            {tab === 'activity' && (
              <>
                <h2>История активности</h2>
                
                <div className="activity-list">
                  {loadingActivity ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      Загрузка активности...
                    </div>
                  ) : activity.length > 0 ? (
                    activity.map((item, index) => (
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
                          <div className="activity-type">
                            {item.type === 'login' && 'Вход в систему'}
                            {item.type === 'purchase' && 'Покупка'}
                            {item.type === 'survey' && 'Опрос'}
                            {item.type === 'profile_update' && 'Обновление профиля'}
                            {item.type === 'plan_view' && 'Просмотр плана'}
                            {!['login', 'purchase', 'survey', 'profile_update', 'plan_view'].includes(item.type) && 'Действие'}
                          </div>
                          <div className="activity-desc">{item.desc || 'Без описания'}</div>
                          <div className="activity-time">{formatDate(item.timestamp)}</div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      История активности пуста
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default DashboardPageV2;
