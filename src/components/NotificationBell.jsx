import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', 'in', [currentUser.uid, 'all']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-bell">
      <button 
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="notification-empty">Нет новых уведомлений</div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt.toDate()).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 