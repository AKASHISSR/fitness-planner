import { useEffect, useState } from 'react';
import './AdminReviewsPage.css';

function AdminPublishedReviewsPage() {
  const [published, setPublished] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('fitgenius_reviews_published') || '[]');
    setPublished(data);
  }, []);

  const removeReview = idx => {
    const newPublished = published.filter((_, i) => i !== idx);
    setPublished(newPublished);
    localStorage.setItem('fitgenius_reviews_published', JSON.stringify(newPublished));
  };

  return (
    <div className="admin-reviews-root">
      <h1>Опубликованные отзывы</h1>
      {published.length === 0 ? (
        <div className="admin-reviews-empty">Нет опубликованных отзывов.</div>
      ) : (
        <div className="admin-reviews-list">
          {published.map((r, i) => (
            <div className="admin-review-card" key={i}>
              <div className="admin-review-header">
                <span className="admin-review-name">{r.name}</span>
                <span className="admin-review-date">{r.date}</span>
              </div>
              <div className="admin-review-text">{r.text}</div>
              <button className="admin-review-btn reject" onClick={() => removeReview(i)}>Удалить</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPublishedReviewsPage; 