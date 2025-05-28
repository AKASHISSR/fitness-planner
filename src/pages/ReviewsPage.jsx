import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ReviewsPage.css?v=1.0.3';

// Компонент для анимированных частиц на фоне
const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      {[...Array(20)].map((_, index) => (
        <div 
          key={index} 
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            width: `${10 + Math.random() * 30}px`,
            height: `${10 + Math.random() * 30}px`,
            opacity: 0.1 + Math.random() * 0.2
          }}
        />
      ))}
    </div>
  );
};

// Компонент карточки отзыва с анимацией
const ReviewCard = ({ review, index }) => {
  // Генерируем случайную оценку от 4 до 5 звезд
  const rating = review.rating || (4 + Math.random());
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <motion.div 
      className="review-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="review-header">
        <div className="review-avatar">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div className="review-info">
          <span className="review-name">{review.name}</span>
          <div className="review-rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star">
                {i < fullStars ? '★' : (i === fullStars && hasHalfStar ? '⯪' : '☆')}
              </span>
            ))}
          </div>
        </div>
        <span className="review-date">{review.date}</span>
      </div>
      <div className="review-text">{review.text}</div>
      <div className="review-footer">
        <div className="review-likes">
          <span className="like-icon">👍</span>
          <span className="like-count">{Math.floor(Math.random() * 20)}</span>
        </div>
      </div>
    </motion.div>
  );
};

function ReviewsPage() {
  const [published, setPublished] = useState([]);
  const [form, setForm] = useState({ name: '', text: '', rating: 5 });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const REVIEWS_PER_PAGE = 6;

  // Пример отзывов для демонстрации, если нет сохраненных
  const demoReviews = [
    { name: 'Анна М.', text: 'Программа питания отлично подошла мне! За месяц -4 кг и гораздо больше энергии. Рекомендую!', date: '15.05.2025', rating: 5 },
    { name: 'Иван К.', text: 'Очень удобное приложение, все понятно и просто. Тренировки составлены грамотно, чувствую прогресс уже через 2 недели.', date: '10.05.2025', rating: 4.5 },
    { name: 'Мария С.', text: 'Выбрала комбо-тариф, это действительно выгодно! Питание и тренировки отлично дополняют друг друга. Сервис на высоте.', date: '05.05.2025', rating: 5 },
    { name: 'Дмитрий В.', text: 'Пользуюсь уже 3 месяца, результаты превзошли ожидания. Особенно нравится, что программа адаптируется под мой прогресс.', date: '28.04.2025', rating: 4.5 },
    { name: 'Елена Т.', text: 'Отличное соотношение цены и качества. Персональный план питания работает, минус 6 кг за 2 месяца!', date: '20.04.2025', rating: 5 },
    { name: 'Алексей П.', text: 'Очень доволен программой тренировок. Упражнения подобраны с учетом моего уровня, нагрузка увеличивается постепенно. Рекомендую!', date: '15.04.2025', rating: 4 },
    { name: 'Ольга Н.', text: 'FitGenius помог мне изменить отношение к питанию. Теперь я знаю, как правильно составлять рацион. Спасибо!', date: '10.04.2025', rating: 5 },
    { name: 'Сергей М.', text: 'Занимаюсь по программе уже 2 месяца. Результаты есть, но хотелось бы больше вариативности в упражнениях.', date: '05.04.2025', rating: 4 },
  ];

  useEffect(() => {
    let pub = JSON.parse(localStorage.getItem('fitgenius_reviews_published') || '[]');
    // Если нет сохраненных отзывов, используем демо-отзывы
    if (pub.length === 0) {
      pub = demoReviews;
      localStorage.setItem('fitgenius_reviews_published', JSON.stringify(demoReviews));
    }
    setPublished(pub);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setForm({ ...form, rating });
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
    setShowConfetti(true);
    setTimeout(() => {
      setSent(false);
      setShowConfetti(false);
    }, 4000);
    setForm({ name: '', text: '', rating: 5 });
  };

  // Пагинация
  const totalPages = Math.ceil(published.length / REVIEWS_PER_PAGE);
  const paginatedReviews = published.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);
  const handlePageChange = (p) => setPage(p);

  // Статистика по отзывам
  const averageRating = published.reduce((acc, curr) => acc + (curr.rating || 5), 0) / published.length;
  const fiveStarPercent = (published.filter(r => Math.round(r.rating || 5) === 5).length / published.length) * 100;

  return (
    <div className="reviews-bg">
      <AnimatedBackground />
      
      <motion.div 
        className="reviews-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="reviews-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Отзывы наших клиентов
        </motion.h1>
        
        <motion.p 
          className="reviews-subheading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Узнайте, что говорят пользователи о наших программах питания и тренировок
        </motion.p>
        
        <div className="reviews-stats">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="stat-value">{averageRating.toFixed(1)}</div>
            <div className="stat-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="star">
                  {i < Math.floor(averageRating) ? '★' : (i === Math.floor(averageRating) && averageRating % 1 >= 0.5 ? '⯪' : '☆')}
                </span>
              ))}
            </div>
            <div className="stat-label">Средняя оценка</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="stat-value">{published.length}</div>
            <div className="stat-label">Всего отзывов</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="stat-value">{fiveStarPercent.toFixed(0)}%</div>
            <div className="stat-label">5-звездочных отзывов</div>
          </motion.div>
        </div>
        
        <motion.div 
          className="reviews-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {published.length === 0 ? (
            <div className="reviews-empty">Пока нет опубликованных отзывов.</div>
          ) : (
            paginatedReviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))
          )}
        </motion.div>
        
        {totalPages > 1 && (
          <motion.div 
            className="reviews-pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {Array.from({ length: totalPages }, (_, idx) => (
              <motion.button
                key={idx}
                className={`reviews-page-btn${page === idx + 1 ? ' active' : ''}`}
                onClick={() => handlePageChange(idx + 1)}
                disabled={page === idx + 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {idx + 1}
              </motion.button>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="review-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <h2 className="form-heading">Поделитесь своим опытом</h2>
          <p className="form-subheading">Ваш отзыв поможет нам стать лучше и поможет другим пользователям сделать выбор</p>
          
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Ваше имя</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Введите ваше имя"
                value={form.name}
                onChange={handleChange}
                className="review-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rating">Ваша оценка</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`rating-star ${star <= form.rating ? 'active' : ''}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="text">Ваш отзыв</label>
              <textarea
                id="text"
                name="text"
                placeholder="Расскажите о вашем опыте использования FitGenius..."
                value={form.text}
                onChange={handleChange}
                className="review-textarea"
                required
              />
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="review-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <span className="error-icon">⚠️</span> {error}
                </motion.div>
              )}
              
              {sent && (
                <motion.div 
                  className="review-success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <span className="success-icon">✓</span> Спасибо! Ваш отзыв отправлен на модерацию.
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button 
              type="submit" 
              className="review-btn"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(79, 209, 101, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Отправить отзыв
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
      
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(100)].map((_, index) => (
            <div 
              key={index} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;