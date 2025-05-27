import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import AdminReviewsPage from './AdminReviewsPage';
import AdminFeedbackPage from './AdminFeedbackPage';
import AdminPublishedReviewsPage from './AdminPublishedReviewsPage';
import AdminVisitsPage from './AdminVisitsPage';
import './AdminPageV2.css';
import { ADMINS } from '../App';

// Компонент для анимированного фона
const AnimatedBackground = () => {
  return (
    <div className="admin-bg">
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          className="admin-particle"
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

// Компонент статистической карточки
const StatCard = ({ title, value, change, icon, isLoading }) => {
  return (
    <motion.div 
      className="admin-stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-stat-title">
        <span className="icon">{icon}</span>
        {title}
      </div>
      {isLoading ? (
        <div className="admin-stat-value">...</div>
      ) : (
        <div className="admin-stat-value">{value}</div>
      )}
      {change && (
        <div className={`admin-stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% за 7 дней
        </div>
      )}
    </motion.div>
  );
};

// Компонент таблицы пользователей
const UsersTable = ({ users, isLoading }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Email</th>
            <th>Статус</th>
            <th>Последний вход</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Загрузка данных...</td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name || 'Без имени'}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td>{formatDate(user.lastLogin)}</td>
                <td className="actions">
                  <button className="action-btn view" title="Просмотр">👁️</button>
                  <button className="action-btn edit" title="Редактировать">✏️</button>
                  <button className="action-btn delete" title="Удалить">🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Нет данных</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Компонент таблицы активности
const ActivityTable = ({ activities, isLoading }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Тип активности</th>
            <th>Описание</th>
            <th>Дата и время</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Загрузка данных...</td>
            </tr>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.email || 'Гость'}</td>
                <td>
                  {activity.type === 'login' && 'Вход в систему'}
                  {activity.type === 'purchase' && 'Покупка'}
                  {activity.type === 'survey' && 'Опрос'}
                  {activity.type === 'profile_update' && 'Обновление профиля'}
                  {activity.type === 'plan_view' && 'Просмотр плана'}
                  {!['login', 'purchase', 'survey', 'profile_update', 'plan_view'].includes(activity.type) && 'Действие'}
                </td>
                <td>{activity.desc || 'Без описания'}</td>
                <td>{formatDate(activity.timestamp)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Нет данных</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Компонент дашборда
const DashboardTab = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVisits: 0,
    totalPurchases: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  useEffect(() => {
    // Загрузка статистики
    async function fetchStats() {
      setIsLoadingStats(true);
      try {
        // Получаем количество пользователей
        const usersQuery = query(collection(db, 'users'));
        const usersSnap = await getDocs(usersQuery);
        const totalUsers = usersSnap.size;

        // Получаем количество активных пользователей (вход за последние 7 дней)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const timestamp = Timestamp.fromDate(sevenDaysAgo);
        
        const activeUsersQuery = query(
          collection(db, 'user_activity'),
          where('type', '==', 'login'),
          where('timestamp', '>=', timestamp)
        );
        const activeUsersSnap = await getDocs(activeUsersQuery);
        const activeUsers = new Set(activeUsersSnap.docs.map(doc => doc.data().email)).size;

        // Получаем количество посещений
        const visitsQuery = query(collection(db, 'visit_logs'));
        const visitsSnap = await getDocs(visitsQuery);
        const totalVisits = visitsSnap.size;

        // Получаем количество покупок
        const purchasesQuery = query(
          collection(db, 'user_activity'),
          where('type', '==', 'purchase')
        );
        const purchasesSnap = await getDocs(purchasesQuery);
        const totalPurchases = purchasesSnap.size;

        setStats({
          totalUsers,
          activeUsers,
          totalVisits,
          totalPurchases
        });
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
      setIsLoadingStats(false);
    }

    // Загрузка последних пользователей
    async function fetchRecentUsers() {
      setIsLoadingUsers(true);
      try {
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('lastLogin', 'desc'),
          limit(5)
        );
        const usersSnap = await getDocs(usersQuery);
        setRecentUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
      setIsLoadingUsers(false);
    }

    // Загрузка последней активности
    async function fetchRecentActivity() {
      setIsLoadingActivity(true);
      try {
        const activityQuery = query(
          collection(db, 'user_activity'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const activitySnap = await getDocs(activityQuery);
        setRecentActivity(activitySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Ошибка при загрузке активности:', error);
      }
      setIsLoadingActivity(false);
    }

    fetchStats();
    fetchRecentUsers();
    fetchRecentActivity();
  }, []);

  return (
    <div>
      <h2><span className="icon">📊</span> Дашборд</h2>
      
      {/* Статистика */}
      <div className="admin-stats">
        <StatCard 
          title="Всего пользователей" 
          value={stats.totalUsers} 
          change={5} 
          icon="👥" 
          isLoading={isLoadingStats} 
        />
        <StatCard 
          title="Активные пользователи" 
          value={stats.activeUsers} 
          change={8} 
          icon="🔥" 
          isLoading={isLoadingStats} 
        />
        <StatCard 
          title="Всего посещений" 
          value={stats.totalVisits} 
          change={12} 
          icon="👁️" 
          isLoading={isLoadingStats} 
        />
        <StatCard 
          title="Всего покупок" 
          value={stats.totalPurchases} 
          change={-3} 
          icon="💰" 
          isLoading={isLoadingStats} 
        />
      </div>
      
      {/* Последние пользователи */}
      <h2><span className="icon">👥</span> Последние пользователи</h2>
      <UsersTable users={recentUsers} isLoading={isLoadingUsers} />
      
      {/* Последняя активность */}
      <h2><span className="icon">📝</span> Последняя активность</h2>
      <ActivityTable activities={recentActivity} isLoading={isLoadingActivity} />
    </div>
  );
};

// Компонент управления пользователями
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('lastLogin', 'desc')
        );
        const usersSnap = await getDocs(usersQuery);
        setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
      setIsLoading(false);
    }

    fetchUsers();
  }, []);

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    // Поиск по имени или email
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Фильтр по статусу
    if (filter === 'active') {
      return matchesSearch && user.active;
    } else if (filter === 'inactive') {
      return matchesSearch && !user.active;
    }
    
    return matchesSearch;
  });

  return (
    <div>
      <h2><span className="icon">👥</span> Управление пользователями</h2>
      
      {/* Поиск и фильтры */}
      <div className="admin-filters">
        <div className="admin-search">
          <span className="icon">🔍</span>
          <input 
            type="text" 
            placeholder="Поиск пользователей..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="admin-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Все пользователи</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
        
        <button className="admin-btn admin-btn-primary">
          <span>➕</span> Добавить пользователя
        </button>
      </div>
      
      {/* Таблица пользователей */}
      <UsersTable users={filteredUsers} isLoading={isLoading} />
    </div>
  );
};

// Компонент управления контентом
const ContentTab = () => {
  return (
    <div>
      <h2><span className="icon">📄</span> Управление контентом</h2>
      
      <div className="admin-stats">
        <StatCard title="Всего статей" value={12} icon="📝" />
        <StatCard title="Опубликовано" value={8} icon="✅" />
        <StatCard title="Черновики" value={4} icon="📋" />
        <StatCard title="Комментарии" value={36} icon="💬" />
      </div>
      
      <div className="admin-filters">
        <div className="admin-search">
          <span className="icon">🔍</span>
          <input type="text" placeholder="Поиск контента..." />
        </div>
        
        <select className="admin-filter">
          <option value="all">Все типы</option>
          <option value="articles">Статьи</option>
          <option value="pages">Страницы</option>
          <option value="comments">Комментарии</option>
        </select>
        
        <button className="admin-btn admin-btn-primary">
          <span>➕</span> Создать
        </button>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Автор</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Как начать правильно питаться</td>
              <td>Статья</td>
              <td>Администратор</td>
              <td>12.05.2025</td>
              <td><span className="status active">Опубликовано</span></td>
              <td className="actions">
                <button className="action-btn view" title="Просмотр">👁️</button>
                <button className="action-btn edit" title="Редактировать">✏️</button>
                <button className="action-btn delete" title="Удалить">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Топ-10 упражнений для пресса</td>
              <td>Статья</td>
              <td>Администратор</td>
              <td>10.05.2025</td>
              <td><span className="status active">Опубликовано</span></td>
              <td className="actions">
                <button className="action-btn view" title="Просмотр">👁️</button>
                <button className="action-btn edit" title="Редактировать">✏️</button>
                <button className="action-btn delete" title="Удалить">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Правила составления программы тренировок</td>
              <td>Статья</td>
              <td>Администратор</td>
              <td>08.05.2025</td>
              <td><span className="status pending">Черновик</span></td>
              <td className="actions">
                <button className="action-btn view" title="Просмотр">👁️</button>
                <button className="action-btn edit" title="Редактировать">✏️</button>
                <button className="action-btn delete" title="Удалить">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Компонент настроек
const SettingsTab = () => {
  return (
    <div>
      <h2><span className="icon">⚙️</span> Настройки сайта</h2>
      
      <div className="admin-form-group">
        <label className="admin-form-label">Название сайта</label>
        <input type="text" className="admin-form-input" defaultValue="FitGenius" />
      </div>
      
      <div className="admin-form-group">
        <label className="admin-form-label">Описание сайта</label>
        <textarea className="admin-form-textarea" defaultValue="Персональный помощник для составления программ питания и тренировок"></textarea>
      </div>
      
      <div className="admin-form-group">
        <label className="admin-form-label">Логотип сайта</label>
        <input type="file" className="admin-form-input" />
      </div>
      
      <div className="admin-form-group">
        <label className="admin-form-label">Цветовая схема</label>
        <select className="admin-form-select">
          <option value="green">Зеленая (по умолчанию)</option>
          <option value="blue">Синяя</option>
          <option value="purple">Фиолетовая</option>
          <option value="orange">Оранжевая</option>
        </select>
      </div>
      
      <div className="admin-form-group">
        <label className="admin-form-label">Email для уведомлений</label>
        <input type="email" className="admin-form-input" defaultValue="admin@fitgenius.com" />
      </div>
      
      <button className="admin-btn admin-btn-primary">
        <span>💾</span> Сохранить настройки
      </button>
    </div>
  );
};

// Главный компонент админ-панели
function AdminPageV2() {
  const [tab, setTab] = useState('dashboard');
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // Проверка прав администратора
  useEffect(() => {
    const email = localStorage.getItem('fitgenius_user');
    let userEmail = '';
    
    if (email) {
      try {
        // Проверяем, если это JSON строка
        if (email.startsWith('{')) {
          const parsedData = JSON.parse(email);
          if (parsedData.email) {
            userEmail = parsedData.email;
          }
        } else if (email.includes('@')) {
          // Просто email строка
          userEmail = email;
        }
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
        userEmail = email;
      }
    }
    
    // Проверка на администратора
    const checkAdmin = () => {
      if (!userEmail) return false;
      
      for (const adminEmail of ADMINS) {
        if (userEmail.toLowerCase() === adminEmail.toLowerCase()) {
          return true;
        }
      }
      
      return false;
    };
    
    const adminStatus = checkAdmin();
    setIsAdmin(adminStatus);
    
    // Если не админ, перенаправляем на главную
    if (!adminStatus) {
      navigate('/');
    }
  }, [navigate]);

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Проверка прав доступа...</h2>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AnimatedBackground />
      
      <motion.div 
        className="admin-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Заголовок админ-панели */}
        <div className="admin-header">
          <div className="admin-header-decoration"></div>
          <div className="admin-header-decoration"></div>
          
          <h1 className="admin-title">Панель администратора FitGenius</h1>
          <div className="admin-subtitle">Управление сайтом и пользователями</div>
          
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => navigate('/dashboard')}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
          >
            <span>🏠</span> Вернуться на сайт
          </button>
        </div>
        
        {/* Вкладки */}
        <div className="admin-tabs">
          <div 
            className={`admin-tab ${tab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setTab('dashboard')}
          >
            <span className="admin-tab-icon">📊</span> Дашборд
          </div>
          <div 
            className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <span className="admin-tab-icon">👥</span> Пользователи
          </div>
          <div 
            className={`admin-tab ${tab === 'content' ? 'active' : ''}`}
            onClick={() => setTab('content')}
          >
            <span className="admin-tab-icon">📄</span> Контент
          </div>
          <div 
            className={`admin-tab ${tab === 'reviews' ? 'active' : ''}`}
            onClick={() => setTab('reviews')}
          >
            <span className="admin-tab-icon">⭐</span> Отзывы
          </div>
          <div 
            className={`admin-tab ${tab === 'published' ? 'active' : ''}`}
            onClick={() => setTab('published')}
          >
            <span className="admin-tab-icon">📝</span> Опубликованные отзывы
          </div>
          <div 
            className={`admin-tab ${tab === 'feedback' ? 'active' : ''}`}
            onClick={() => setTab('feedback')}
          >
            <span className="admin-tab-icon">📨</span> Обратная связь
          </div>
          <div 
            className={`admin-tab ${tab === 'visits' ? 'active' : ''}`}
            onClick={() => setTab('visits')}
          >
            <span className="admin-tab-icon">👁️</span> История заходов
          </div>
          <div 
            className={`admin-tab ${tab === 'settings' ? 'active' : ''}`}
            onClick={() => setTab('settings')}
          >
            <span className="admin-tab-icon">⚙️</span> Настройки
          </div>
        </div>
        
        {/* Содержимое вкладок */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={tab}
            className="admin-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'dashboard' && <DashboardTab />}
            {tab === 'users' && <UsersTab />}
            {tab === 'content' && <ContentTab />}
            {tab === 'reviews' && <AdminReviewsPage />}
            {tab === 'published' && <AdminPublishedReviewsPage />}
            {tab === 'feedback' && <AdminFeedbackPage />}
            {tab === 'visits' && <AdminVisitsPage />}
            {tab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AdminPageV2;
