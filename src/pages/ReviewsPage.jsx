import { useState, useEffect } from 'react';
import './ReviewsPage.css';

function ReviewsPage() {
  const [published, setPublished] = useState([]);
  const [form, setForm] = useState({ name: '', text: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const REVIEWS_PER_PAGE = 8;

  useEffect(() => {
    const pub = JSON.parse(localStorage.getItem('fitgenius_reviews_published') || '[]');
    setPublished(pub.reverse());
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.text) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setError('');
    // Сохраняем отзыв в localStorage (ожидает модерации)
    const reviews = JSON.parse(localStorage.getItem('fitgenius_reviews_pending') || '[]');
    reviews.push({ ...form, date: new Date().toLocaleString() });
    localStorage.setItem('fitgenius_reviews_pending', JSON.stringify(reviews));
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', text: '' });
  };

  // Пагинация
  const totalPages = Math.ceil(published.length / REVIEWS_PER_PAGE);
  const paginatedReviews = published.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);
  const handlePageChange = (p) => setPage(p);

  return (
    <div className="reviews-root">
      <h1>Отзывы наших пользователей</h1>
      <h2>Оставьте свой отзыв</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
          value={form.name}
          onChange={handleChange}
          className="review-input"
          required
        />
        <textarea
          name="text"
          placeholder="Ваш отзыв..."
          value={form.text}
          onChange={handleChange}
          className="review-textarea"
          required
        />
        {error && <div className="review-error">{error}</div>}
        {sent && <div className="review-success">Спасибо! Ваш отзыв отправлен на модерацию.</div>}
        <button type="submit" className="review-btn">Отправить отзыв</button>
      </form>
      {published.length === 0 ? (
        <div className="reviews-empty">Пока нет опубликованных отзывов.</div>
      ) : (
        <>
          <div className="reviews-list">
            {paginatedReviews.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-header">
                  <span className="review-name">{r.name}</span>
                  <span className="review-date">{r.date}</span>
                </div>
                <div className="review-text">{r.text}</div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="reviews-pagination">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  className={`reviews-page-btn${page === idx + 1 ? ' active' : ''}`}
                  onClick={() => handlePageChange(idx + 1)}
                  disabled={page === idx + 1}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewsPage;