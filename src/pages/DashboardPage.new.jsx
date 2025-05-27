import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, uploadUserAvatarToImgbb, getUserAvatar } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './DashboardPage.css';
import './DashboardEnhanced.css';
import { ADMINS } from '../App';

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
  // ... остальные дни ...
];

const shoppingList = [
  'Овсянка', 'Ягоды', 'Орехи', 'Куриная грудка', 'Гречка', 'Овощи',
  'Творог', 'Фрукты', 'Яблоко', 'Миндаль', 'Яйца', 'Хлеб', 'Рыба', 'Картофель', 'Салат', 'Йогурт'
];

const workoutPlan = [
  { day: 'Понедельник', workout: 'Силовая: приседания, отжимания, планка' },
  { day: 'Вторник', workout: 'Кардио: бег 30 мин, скакалка' },
  { day: 'Среда', workout: 'Отдых или йога' },
  { day: 'Четверг', workout: 'Силовая: выпады, подтягивания, пресс' },
  { day: 'Пятница', workout: 'Кардио: велотренажёр, прыжки' },
  { day: 'Суббота', workout: 'Функционалка: бурпи, выпрыгивания, планка' },
  { day: 'Воскресенье', workout: 'Отдых' },
];

function exportTextToPDF(text, filename = 'plan.pdf') {
  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<pre style="font-family:inherit;font-size:16px;white-space:pre-wrap;">' + text + '</pre>');
  win.document.close();
  win.print();
}

function DashboardPage() {
  const [tab, setTab] = useState('food');
  const [paidType, setPaidType] = useState(null);
  const [mealPlan, setMealPlan] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [user, setUser] = useState({ email: '', name: '' });
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState('');
  const [loadingName, setLoadingName] = useState(false);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setPaidType(localStorage.getItem('fitgenius_paid_type'));
    setMealPlan(localStorage.getItem('fitgenius_meal_plan') || '');
    setWorkoutPlan(localStorage.getItem('fitgenius_workout_plan') || '');
    const email = localStorage.getItem('fitgenius_user') || '';
    // Загружаем имя из Firestore, если есть email
    async function fetchName() {
      let name = localStorage.getItem('fitgenius_name') || 'Пользователь';
      if (email) {
        setLoadingName(true);
        try {
          const docRef = doc(db, 'users', email);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().name) {
            name = snap.data().name;
          }
        } catch {}
        setLoadingName(false);
      }
      setUser({ email, name });
      setNewName(name);
    }
    fetchName();
    // Загружаем историю активности
    async function fetchActivity() {
      if (!email) return;
      setLoadingActivity(true);
      try {
        const docRef = doc(db, 'activity', email);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().events) {
          const events = snap.data().events;
          setActivity(events.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
        }
      } catch {}
      setLoadingActivity(false);
    }
    fetchActivity();
    // Загружаем аватар
    async function fetchAvatar() {
      if (!email) return;
      setLoadingAvatar(true);
      try {
        const url = await getUserAvatar(email);
        if (url) setAvatarUrl(url);
      } catch {}
      setLoadingAvatar(false);
    }
    fetchAvatar();
  }, []);

  // Сохранение имени пользователя
  const handleNameSave = async () => {
    if (!user.email || !newName.trim() || loadingName) return;
    setLoadingName(true);
    try {
      const docRef = doc(db, 'users', user.email);
      await setDoc(docRef, { name: newName.trim() }, { merge: true });
      setUser({ ...user, name: newName.trim() });
      localStorage.setItem('fitgenius_name', newName.trim());
      setEditName(false);
    } catch {}
    setLoadingName(false);
  };

  // Обработчик экспорта в PDF
  const handleExport = () => {
    const text = tab === 'food' ? mealPlan : workoutPlan;
    exportTextToPDF(text, `${tab === 'food' ? 'meal' : 'workout'}_plan.pdf`);
  };

  // Обработчик изменения аватара
  const handleAvatarChange = (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!user.email) {
      setAvatarError('Необходимо войти в аккаунт');
      return;
    }
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Файл слишком большой (макс. 5MB)');
      return;
    }
    
    setLoadingAvatar(true);
    setAvatarError('');
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const url = await uploadUserAvatarToImgbb(user.email, event.target.result);
        if (url) {
          setAvatarUrl(url);
        } else {
          setAvatarError('Ошибка загрузки аватара');
        }
      } catch (error) {
        console.error('Ошибка загрузки аватара:', error);
        setAvatarError('Ошибка загрузки аватара');
      } finally {
        setLoadingAvatar(false);
      }
    };
    
    reader.readAsDataURL(file);
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

  // Проверка, является ли пользователь администратором
  const isAdmin = ADMINS.includes(user.email);
  
  // Проверка оплаченных планов
  const isFoodPaid = paidType === 'food' || paidType === 'combo';
  const isWorkoutPaid = paidType === 'workout' || paidType === 'combo';

  return (
    <div className="dashboard-container">
      {/* Карточка профиля */}
      <div className="profile-card">
        <div className="profile-header">
          {/* Аватар */}
          <div className="avatar-container" onClick={() => document.getElementById('avatar-input').click()}>
            {loadingAvatar ? (
              <div className="avatar-placeholder">
                <span style={{fontSize:36,animation:'spin 1s linear infinite'}}>⏳</span>
              </div>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="Аватар" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              style={{display:'none'}}
              onChange={handleAvatarChange}
            />
            <div className="avatar-overlay">
              <span>Изменить</span>
            </div>
          </div>

          {/* Информация о пользователе */}
          <div className="user-info">
            {editName ? (
              <div className="edit-name-form">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="edit-name-input"
                  maxLength={32}
                  disabled={loadingName}
                  placeholder="Введите имя"
                />
                <button 
                  className="save-name-btn" 
                  onClick={handleNameSave} 
                  disabled={loadingName || !newName.trim()}
                >
                  Сохранить
                </button>
                <button 
                  className="cancel-name-btn" 
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
                {loadingName ? '⏳ Загрузка...' : user.name}
                <button 
                  className="edit-name-btn" 
                  onClick={() => setEditName(true)}
                  title="Редактировать имя"
                >
                  ✏️
                </button>
              </div>
            )}
            <div className="user-email">{user.email || 'Гостевой доступ'}</div>
            <button className="logout-btn" onClick={handleLogout}>
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="dashboard-content">
        {/* Кнопка 'Админ' только для админов */}
        {isAdmin && (
          <button className="admin-btn" onClick={() => navigate('/admin')}>
            Админ-панель
          </button>
        )}

        {/* Табы */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${tab === 'food' ? 'active' : ''}`}
            onClick={() => setTab('food')}
          >
            Программа питания
          </button>
          <button
            className={`tab-btn ${tab === 'workout' ? 'active' : ''}`}
            onClick={() => setTab('workout')}
          >
            Программа тренировок
          </button>
          <button
            className={`tab-btn ${tab === 'activity' ? 'active' : ''}`}
            onClick={() => setTab('activity')}
          >
            История активности
          </button>
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={tab === 'food' ? !mealPlan : !workoutPlan}
          >
            Экспорт в PDF
          </button>
        </div>

        {/* Содержимое табов */}
        <div className="tab-content">
          {tab === 'food' && (
            isFoodPaid ? (
              mealPlan
                ? <pre className="plan-container">{mealPlan}</pre>
                : <div>Ваша программа питания скоро появится!</div>
            ) : (
              <div className="not-paid-message">
                <b>Не оплачено</b>
                <p>Пройдите опрос и приобретите программу питания!</p>
                <button className="buy-now-btn" onClick={() => navigate('/payment')}>Приобрести</button>
              </div>
            )
          )}

          {tab === 'workout' && (
            isWorkoutPaid ? (
              workoutPlan
                ? <pre className="plan-container">{workoutPlan}</pre>
                : <div>Ваша программа тренировок скоро появится!</div>
            ) : (
              <div className="not-paid-message">
                <b>Не оплачено</b>
                <p>Пройдите опрос и приобретите программу тренировок!</p>
                <button className="buy-now-btn" onClick={() => navigate('/payment')}>Приобрести</button>
              </div>
            )
          )}

          {tab === 'activity' && (
            <div>
              <h3 className="activity-title">История активности</h3>
              {loadingActivity ? (
                <div>Загрузка...</div>
              ) : activity.length === 0 ? (
                <div>Нет данных об активности.</div>
              ) : (
                <div className="activity-list">
                  {activity.map(ev => (
                    <div key={ev.id} className="activity-item">
                      <div className="activity-header">
                        <div className="activity-time">
                          {ev.timestamp ? new Date(ev.timestamp.seconds*1000).toLocaleString() : ''}
                        </div>
                        <div className="activity-type">
                          {ev.type || '-'}
                        </div>
                      </div>
                      <div className="activity-desc">
                        {ev.desc || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
