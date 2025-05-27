import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ADMINS } from '../App';

function DebugPage() {
  const [userInfo, setUserInfo] = useState({
    raw: '',
    parsed: null,
    email: '',
    isAdmin: false
  });

  useEffect(() => {
    // Получаем данные из localStorage
    const userRaw = localStorage.getItem('fitgenius_user');
    let parsedUser = null;
    let userEmail = '';
    
    try {
      // Пытаемся распарсить JSON
      parsedUser = JSON.parse(userRaw);
      userEmail = parsedUser?.email || '';
    } catch (e) {
      console.error('Ошибка при парсинге JSON:', e);
      userEmail = userRaw || '';
    }
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = userEmail && ADMINS.includes(userEmail);
    
    setUserInfo({
      raw: userRaw || 'не найдено',
      parsed: parsedUser,
      email: userEmail,
      isAdmin
    });
  }, []);

  // Функция для сохранения тестового email в localStorage
  const saveTestEmail = () => {
    const testEmail = 'laptinskii07@gmail.com';
    localStorage.setItem('fitgenius_user', testEmail);
    window.location.reload();
  };

  // Функция для сохранения тестового JSON-объекта в localStorage
  const saveTestJson = () => {
    const testJson = JSON.stringify({
      uid: '123456',
      email: 'laptinskii07@gmail.com',
      name: 'Test User'
    });
    localStorage.setItem('fitgenius_user', testJson);
    window.location.reload();
  };

  // Функция для очистки localStorage
  const clearStorage = () => {
    localStorage.removeItem('fitgenius_user');
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Отладочная страница</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Информация о пользователе</h2>
        <p><strong>Сырые данные из localStorage:</strong> {userInfo.raw}</p>
        <p><strong>Email пользователя:</strong> {userInfo.email}</p>
        <p><strong>Является администратором:</strong> {userInfo.isAdmin ? 'Да' : 'Нет'}</p>
        
        <h3>Распарсенный объект:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(userInfo.parsed, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Список администраторов</h2>
        <ul>
          {ADMINS.map((admin, index) => (
            <li key={index}>{admin}</li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Тестовые действия</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={saveTestEmail} 
            style={{ padding: '8px 16px', background: '#4fd165', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Сохранить тестовый email
          </button>
          
          <button 
            onClick={saveTestJson} 
            style={{ padding: '8px 16px', background: '#4fd165', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Сохранить тестовый JSON
          </button>
          
          <button 
            onClick={clearStorage} 
            style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Очистить localStorage
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/admin" style={{ display: 'inline-block', padding: '8px 16px', background: '#4fd165', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Перейти в админ-панель</Link>
      </div>
    </div>
  );
}

export default DebugPage;
