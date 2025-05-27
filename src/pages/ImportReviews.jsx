import React from 'react';
import sampleReviews from '../data/sampleReviews';

function ImportReviews() {
  const handleImportReviews = () => {
    // Получаем текущие опубликованные отзывы
    const currentReviews = JSON.parse(localStorage.getItem('fitgenius_reviews_published') || '[]');
    
    // Проверяем, есть ли уже отзывы с такими же именами и датами
    const newReviews = sampleReviews.filter(newReview => {
      return !currentReviews.some(existingReview => 
        existingReview.name === newReview.name && existingReview.date === newReview.date
      );
    });
    
    // Добавляем только новые отзывы
    const updatedReviews = [...currentReviews, ...newReviews];
    localStorage.setItem('fitgenius_reviews_published', JSON.stringify(updatedReviews));
    
    alert(`Добавлено ${newReviews.length} новых отзывов!`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Импорт креативных отзывов</h1>
      <p>Нажмите кнопку ниже, чтобы добавить креативные отзывы в приложение:</p>
      <button 
        onClick={handleImportReviews}
        style={{
          background: '#4fd165',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(79, 209, 101, 0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        Импортировать отзывы
      </button>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Предварительный просмотр:</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {sampleReviews.map((review, index) => (
            <div 
              key={index} 
              style={{
                padding: '15px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>{review.name}</span>
                <span style={{ opacity: 0.7 }}>{review.date}</span>
              </div>
              <div>{review.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImportReviews;
