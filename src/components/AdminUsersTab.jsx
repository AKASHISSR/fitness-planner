import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, getDocs, doc, updateDoc, Timestamp, where } from 'firebase/firestore';
import StatusBadge from './StatusBadge';
import AdminModal from './AdminModal';
import { ADMINS } from '../App';

// Компонент статистической карточки
const StatCard = ({ title, value, change, icon, isLoading }) => {
  return (
    <motion.div 
      className="admin-card"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="admin-card-icon">{icon}</div>
      <div className="admin-card-content">
        <div className="admin-card-title">{title}</div>
        {isLoading ? (
          <div className="admin-card-value-skeleton"></div>
        ) : (
          <div className="admin-card-value">{value}</div>
        )}
        {change && (
          <div className={`admin-card-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Форматирование даты
function formatDate(timestamp) {
  if (!timestamp) return 'Неизвестно';
  
  let date;
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return 'Неизвестно';
  }
  
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Компонент управления пользователями
function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatus, setUserStatus] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Загрузка пользователей из Firestore
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Запрос к Firestore для получения пользователей
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      
      if (!snapshot.empty) {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.id,
          ...doc.data(),
          isAdmin: ADMINS.some(admin => admin.toLowerCase() === doc.id.toLowerCase())
        }));
        
        // Получаем информацию о последнем входе для каждого пользователя
        const userActivitiesQuery = query(
          collection(db, 'user_activity'),
          where('type', '==', 'login')
        );
        const activitiesSnapshot = await getDocs(userActivitiesQuery);
        
        // Создаем словарь последних входов
        const lastLogins = {};
        activitiesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const email = data.email;
          const timestamp = data.timestamp;
          
          if (!lastLogins[email] || timestamp > lastLogins[email]) {
            lastLogins[email] = timestamp;
          }
        });
        
        // Добавляем информацию о последнем входе к пользователям
        const usersWithLastLogin = usersData.map(user => ({
          ...user,
          lastLogin: lastLogins[user.email] || null,
          status: user.status || 'active'
        }));
        
        setUsers(usersWithLastLogin);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
    setIsLoading(false);
  };

  // Загрузка активности пользователя
  const fetchUserActivities = async (email) => {
    setIsLoadingActivities(true);
    try {
      const activitiesQuery = query(
        collection(db, 'user_activity'),
        where('email', '==', email),
        where('timestamp', '>=', Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
      );
      const snapshot = await getDocs(activitiesQuery);
      
      if (!snapshot.empty) {
        const activitiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        setUserActivities(activitiesData);
      } else {
        setUserActivities([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке активности пользователя:', error);
    }
    setIsLoadingActivities(false);
  };

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = userStatus === 'all' || user.status === userStatus;
    return matchesSearch && matchesStatus;
  });

  // Обработчик блокировки/разблокировки пользователя
  const handleToggleUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await updateDoc(doc(db, 'users', id), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      setUsers(users.map(user => {
        if (user.id === id) {
          return {
            ...user,
            status: newStatus,
            updatedAt: Timestamp.now()
          };
        }
        return user;
      }));
    } catch (error) {
      console.error('Ошибка при изменении статуса пользователя:', error);
      alert('Произошла ошибка при изменении статуса пользователя. Пожалуйста, попробуйте еще раз.');
    }
  };

  // Обработчик просмотра деталей пользователя
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    fetchUserActivities(user.email);
    setShowUserModal(true);
  };

  // Получение иконки для типа активности
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return '🔑';
      case 'purchase':
        return '💰';
      case 'profile_update':
        return '✏️';
      default:
        return '📝';
    }
  };

  return (
    <div>
      <h2><span className="icon">👥</span> Управление пользователями</h2>
      
      <div className="admin-stats">
        <StatCard 
          title="Всего пользователей" 
          value={users.length} 
          icon="👤" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Активные" 
          value={users.filter(user => user.status === 'active').length} 
          icon="✅" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Заблокированные" 
          value={users.filter(user => user.status === 'blocked').length} 
          icon="🚫" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Администраторы" 
          value={users.filter(user => user.isAdmin).length} 
          icon="👑" 
          isLoading={isLoading} 
        />
      </div>
      
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
          value={userStatus}
          onChange={(e) => setUserStatus(e.target.value)}
        >
          <option value="all">Все пользователи</option>
          <option value="active">Активные</option>
          <option value="blocked">Заблокированные</option>
        </select>
      </div>
      
      {isLoading ? (
        <div className="admin-loading">Загрузка пользователей</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Последний вход</th>
                <th>Статус</th>
                <th>Права</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name || 'Не указано'}</td>
                    <td>{user.email}</td>
                    <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Неизвестно'}</td>
                    <td>
                      <StatusBadge 
                        type={user.status === 'active' ? 'success' : 'danger'} 
                        text={user.status === 'active' ? 'Активен' : 'Заблокирован'} 
                      />
                    </td>
                    <td>
                      <StatusBadge 
                        type={user.isAdmin ? 'primary' : 'default'} 
                        text={user.isAdmin ? 'Администратор' : 'Пользователь'} 
                      />
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button 
                          className="admin-action-btn" 
                          title="Просмотреть детали"
                          onClick={() => handleViewUserDetails(user)}
                        >
                          👁️
                        </button>
                        <button 
                          className="admin-action-btn" 
                          title={user.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                        >
                          {user.status === 'active' ? '🔒' : '🔓'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-empty-table">
                    Пользователи не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Модальное окно с деталями пользователя */}
      <AdminModal 
        isOpen={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        title={`Детали пользователя: ${selectedUser?.name || selectedUser?.email || 'Пользователь'}`}
      >
        {selectedUser && (
          <div>
            <div className="admin-user-details">
              <div className="admin-user-detail">
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div className="admin-user-detail">
                <strong>Имя:</strong> {selectedUser.name || 'Не указано'}
              </div>
              <div className="admin-user-detail">
                <strong>Статус:</strong> 
                <StatusBadge 
                  type={selectedUser.status === 'active' ? 'success' : 'danger'} 
                  text={selectedUser.status === 'active' ? 'Активен' : 'Заблокирован'} 
                />
              </div>
              <div className="admin-user-detail">
                <strong>Права:</strong> 
                <StatusBadge 
                  type={selectedUser.isAdmin ? 'primary' : 'default'} 
                  text={selectedUser.isAdmin ? 'Администратор' : 'Пользователь'} 
                />
              </div>
              <div className="admin-user-detail">
                <strong>Последний вход:</strong> {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Неизвестно'}
              </div>
            </div>
            
            <h4>Активность пользователя (последние 30 дней)</h4>
            
            {isLoadingActivities ? (
              <div className="admin-loading">Загрузка активности</div>
            ) : userActivities.length > 0 ? (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Тип</th>
                      <th>Описание</th>
                      <th>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActivities.map(activity => (
                      <tr key={activity.id}>
                        <td>
                          <span className="activity-icon">
                            {getActivityIcon(activity.type)}
                          </span>
                          {activity.type === 'login' ? 'Вход' : 
                           activity.type === 'purchase' ? 'Покупка' : 
                           activity.type === 'profile_update' ? 'Обновление профиля' : 
                           'Другое'}
                        </td>
                        <td>{activity.desc || 'Нет описания'}</td>
                        <td>{formatDate(activity.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty-table" style={{ padding: '1rem', textAlign: 'center' }}>
                Активность не найдена
              </div>
            )}
            
            <div className="admin-form-actions">
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowUserModal(false)}
              >
                Закрыть
              </button>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.status)}
              >
                {selectedUser.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

export default AdminUsersTab;
