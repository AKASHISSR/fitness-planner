import { useEffect, useState } from 'react';
import './AdminReviewsPage.css';

function AdminReviewsPage() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('fitgenius_reviews_pending') || '[]');
    setPending(data);
  }, []);

  const publishReview = idx => {
    const review = pending[idx];
    // Добавляем в опубликованные
    const published = JSON.parse(localStorage.getItem('fitgenius_reviews_published') || '[]');
    published.unshift(review);
    localStorage.setItem('fitgenius_reviews_published', JSON.stringify(published));
    // Удаляем из ожидающих
    const newPending = pending.filter((_, i) => i !== idx);
    setPending(newPending);
    localStorage.setItem('fitgenius_reviews_pending', JSON.stringify(newPending));
  };

  const rejectReview = idx => {
    // Просто удаляем из ожидающих
    const newPending = pending.filter((_, i) => i !== idx);
    setPending(newPending);
    localStorage.setItem('fitgenius_reviews_pending', JSON.stringify(newPending));
  };

  return (
    <div className="admin-reviews-root">
      <h1>Модерация отзывов</h1>
      {pending.length === 0 ? (
        <div className="admin-reviews-empty">Нет отзывов на модерацию.</div>
      ) : (
        <div className="admin-reviews-list">
          {pending.map((r, i) => (
            <div className="admin-review-card" key={i}>
              <div className="admin-review-header">
                <span className="admin-review-name">{r.name}</span>
                <span className="admin-review-date">{r.date}</span>
              </div>
              <div className="admin-review-text">{r.text}</div>
              <button className="admin-review-btn" onClick={() => publishReview(i)}>Опубликовать</button>
              <button className="admin-review-btn reject" onClick={() => rejectReview(i)}>Отклонить</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviewsPage; 