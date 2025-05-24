import { useState } from 'react';
import AdminReviewsPage from './AdminReviewsPage';
import AdminFeedbackPage from './AdminFeedbackPage';
import AdminPublishedReviewsPage from './AdminPublishedReviewsPage';
import AdminVisitsPage from './AdminVisitsPage';
import './AdminPage.css';

function AdminPage() {
  const [tab, setTab] = useState('reviews');
  return (
    <div className="admin-tabs-root">
      <div className="admin-tabs-bar">
        <button
          className={tab === 'reviews' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setTab('reviews')}
        >
          Модерация отзывов
        </button>
        <button
          className={tab === 'published' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setTab('published')}
        >
          Опубликованные отзывы
        </button>
        <button
          className={tab === 'feedback' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setTab('feedback')}
        >
          Форма обратной связи
        </button>
        <button
          className={tab === 'visits' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setTab('visits')}
        >
          История заходов
        </button>
      </div>
      <div className="admin-tab-content">
        {tab === 'reviews' && <AdminReviewsPage />}
        {tab === 'published' && <AdminPublishedReviewsPage />}
        {tab === 'feedback' && <AdminFeedbackPage />}
        {tab === 'visits' && <AdminVisitsPage />}
      </div>
    </div>
  );
}

export default AdminPage;
