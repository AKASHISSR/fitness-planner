import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, getDocs, doc, setDoc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import AdminModal from './AdminModal';
import StatusBadge from './StatusBadge';

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

// Компонент управления контентом
function AdminContentTab() {
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'article',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  // Загрузка контента из Firestore
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // Запрос к Firestore для получения контента
      const contentQuery = query(collection(db, 'content'));
      const snapshot = await getDocs(contentQuery);
      
      if (snapshot.empty) {
        // Если контент не найден, используем моковые данные
        const mockContent = [
          {
            id: '1',
            title: 'Как начать правильно питаться',
            type: 'article',
            author: 'Администратор',
            date: Timestamp.fromDate(new Date()),
            status: 'published',
            content: 'Содержание статьи о правильном питании...'
          },
          {
            id: '2',
            title: 'Эффективные тренировки дома',
            type: 'article',
            author: 'Администратор',
            date: Timestamp.fromDate(new Date()),
            status: 'published',
            content: 'Содержание статьи о тренировках дома...'
          },
          {
            id: '3',
            title: 'О нас',
            type: 'page',
            author: 'Администратор',
            date: Timestamp.fromDate(new Date()),
            status: 'published',
            content: 'Содержание страницы о нас...'
          },
          {
            id: '4',
            title: 'Новая программа тренировок',
            type: 'article',
            author: 'Администратор',
            date: Timestamp.fromDate(new Date()),
            status: 'draft',
            content: 'Содержание статьи о новой программе тренировок...'
          }
        ];
        
        // Сохраняем моковые данные в Firestore
        for (const item of mockContent) {
          await setDoc(doc(db, 'content', item.id), item);
        }
        
        setContent(mockContent);
      } else {
        // Если контент найден, используем его
        const contentData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setContent(contentData);
      }
    } catch (error) {
      console.error('Ошибка при загрузке контента:', error);
    }
    setIsLoading(false);
  };

  // Фильтрация контента
  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = contentType === 'all' || item.type === contentType;
    return matchesSearch && matchesType;
  });

  // Обработчик создания нового контента
  const handleCreateContent = () => {
    setEditingContent(null);
    setNewContent({
      title: '',
      type: 'article',
      content: '',
      status: 'draft'
    });
    setShowAddModal(true);
  };

  // Обработчик редактирования контента
  const handleEditContent = (item) => {
    setEditingContent(item.id);
    setNewContent({
      title: item.title,
      type: item.type,
      content: item.content,
      status: item.status
    });
    setShowAddModal(true);
  };

  // Обработчик сохранения контента
  const handleSaveContent = async () => {
    try {
      if (editingContent) {
        // Обновление существующего контента
        await updateDoc(doc(db, 'content', editingContent), {
          ...newContent,
          updatedAt: Timestamp.now()
        });
        
        setContent(content.map(item => 
          item.id === editingContent 
            ? { 
                ...item, 
                ...newContent, 
                updatedAt: Timestamp.now() 
              } 
            : item
        ));
      } else {
        // Создание нового контента
        const newItem = {
          ...newContent,
          id: Date.now().toString(),
          author: 'Администратор',
          date: Timestamp.now()
        };
        
        await setDoc(doc(db, 'content', newItem.id), newItem);
        setContent([...content, newItem]);
      }
      
      setShowAddModal(false);
      setNewContent({
        title: '',
        type: 'article',
        content: '',
        status: 'draft'
      });
      setEditingContent(null);
    } catch (error) {
      console.error('Ошибка при сохранении контента:', error);
      alert('Произошла ошибка при сохранении контента. Пожалуйста, попробуйте еще раз.');
    }
  };

  // Обработчик удаления контента
  const handleDeleteContent = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот контент?')) {
      try {
        await deleteDoc(doc(db, 'content', id));
        setContent(content.filter(item => item.id !== id));
      } catch (error) {
        console.error('Ошибка при удалении контента:', error);
        alert('Произошла ошибка при удалении контента. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  // Обработчик изменения статуса контента
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'content', id), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      setContent(content.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: newStatus, 
              updatedAt: Timestamp.now() 
            } 
          : item
      ));
    } catch (error) {
      console.error('Ошибка при изменении статуса контента:', error);
      alert('Произошла ошибка при изменении статуса контента. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div>
      <h2><span className="icon">📄</span> Управление контентом</h2>
      
      <div className="admin-stats">
        <StatCard 
          title="Всего контента" 
          value={content.length} 
          icon="📝" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Опубликовано" 
          value={content.filter(item => item.status === 'published').length} 
          icon="✅" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Черновики" 
          value={content.filter(item => item.status === 'draft').length} 
          icon="📋" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Страницы" 
          value={content.filter(item => item.type === 'page').length} 
          icon="📃" 
          isLoading={isLoading} 
        />
      </div>
      
      <div className="admin-filters">
        <div className="admin-search">
          <span className="icon">🔍</span>
          <input 
            type="text" 
            placeholder="Поиск контента..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="admin-filter"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="all">Все типы</option>
          <option value="article">Статьи</option>
          <option value="page">Страницы</option>
        </select>
        
        <button 
          className="admin-btn admin-btn-primary"
          onClick={handleCreateContent}
        >
          <span>➕</span> Создать
        </button>
      </div>
      
      {isLoading ? (
        <div className="admin-loading">Загрузка контента</div>
      ) : (
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
              {filteredContent.length > 0 ? (
                filteredContent.map(item => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>
                      {item.type === 'article' ? 'Статья' : 'Страница'}
                    </td>
                    <td>{item.author}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>
                      <StatusBadge 
                        type={item.status === 'published' ? 'success' : 'warning'} 
                        text={item.status === 'published' ? 'Опубликовано' : 'Черновик'} 
                      />
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button 
                          className="admin-action-btn" 
                          title="Редактировать"
                          onClick={() => handleEditContent(item)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="admin-action-btn" 
                          title="Удалить"
                          onClick={() => handleDeleteContent(item.id)}
                        >
                          🗑️
                        </button>
                        <button 
                          className="admin-action-btn" 
                          title={item.status === 'published' ? 'В черновики' : 'Опубликовать'}
                          onClick={() => handleToggleStatus(item.id, item.status)}
                        >
                          {item.status === 'published' ? '📋' : '📢'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-empty-table">
                    Контент не найден
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Модальное окно для создания/редактирования контента */}
      <AdminModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title={editingContent ? 'Редактирование контента' : 'Создание нового контента'}
      >
        <div className="admin-form-group">
          <label>Название</label>
          <input 
            type="text" 
            value={newContent.title}
            onChange={(e) => setNewContent({...newContent, title: e.target.value})}
            placeholder="Введите название"
          />
        </div>
        <div className="admin-form-group">
          <label>Тип</label>
          <select
            value={newContent.type}
            onChange={(e) => setNewContent({...newContent, type: e.target.value})}
          >
            <option value="article">Статья</option>
            <option value="page">Страница</option>
          </select>
        </div>
        <div className="admin-form-group">
          <label>Содержание</label>
          <textarea 
            rows="5"
            value={newContent.content}
            onChange={(e) => setNewContent({...newContent, content: e.target.value})}
            placeholder="Введите содержание"
          ></textarea>
        </div>
        <div className="admin-form-group">
          <label>Статус</label>
          <select
            value={newContent.status}
            onChange={(e) => setNewContent({...newContent, status: e.target.value})}
          >
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
          </select>
        </div>
        <div className="admin-form-actions">
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => setShowAddModal(false)}
          >
            Отмена
          </button>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={handleSaveContent}
            disabled={!newContent.title || !newContent.content}
          >
            Сохранить
          </button>
        </div>
      </AdminModal>
    </div>
  );
}

export default AdminContentTab;
