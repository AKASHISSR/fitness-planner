import React, { useState } from 'react';
import { addSampleReviews, addSampleVisits, addAllSampleData } from '../utils/addSampleData';
import Card from '../components/Card';

function SampleDataPage() {
  const [result, setResult] = useState(null);

  const handleAddReviews = () => {
    const count = addSampleReviews();
    setResult({ type: 'reviews', count });
  };

  const handleAddVisits = () => {
    const count = addSampleVisits();
    setResult({ type: 'visits', count });
  };

  const handleAddAll = () => {
    const { reviewsAdded, visitsAdded } = addAllSampleData();
    setResult({ type: 'all', reviewsAdded, visitsAdded });
  };

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '20px', textAlign: 'center' }}>
        Добавление тестовых данных
      </h1>
      
      <Card className="glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Отзывы</h2>
        <p style={{ marginBottom: '15px' }}>
          Добавить креативные отзывы пользователей в раздел отзывов. 
          Отзывы будут видны на странице отзывов и в админ-панели.
        </p>
        <button 
          onClick={handleAddReviews}
          style={{
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Добавить отзывы
        </button>
      </Card>

      <Card className="glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>История посещений</h2>
        <p style={{ marginBottom: '15px' }}>
          Добавить тестовую историю посещений сайта для отображения в админ-панели.
          Будет создано 30 случайных записей за последнюю неделю.
        </p>
        <button 
          onClick={handleAddVisits}
          style={{
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Добавить историю
        </button>
      </Card>

      <Card className="glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Добавить все данные</h2>
        <p style={{ marginBottom: '15px' }}>
          Добавить все тестовые данные одним нажатием: отзывы и историю посещений.
        </p>
        <button 
          onClick={handleAddAll}
          style={{
            background: 'var(--primary-dark)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Добавить все данные
        </button>
      </Card>

      {result && (
        <Card className="glass-card" style={{ padding: '20px', background: 'rgba(79, 209, 101, 0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Результат</h2>
          {result.type === 'reviews' && (
            <p>Добавлено {result.count} новых отзывов.</p>
          )}
          {result.type === 'visits' && (
            <p>Добавлено {result.count} записей в историю посещений.</p>
          )}
          {result.type === 'all' && (
            <>
              <p>Добавлено {result.reviewsAdded} новых отзывов.</p>
              <p>Добавлено {result.visitsAdded} записей в историю посещений.</p>
            </>
          )}
          <p style={{ marginTop: '15px' }}>
            Перейдите в <a href="/reviews" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>раздел отзывов</a> или <a href="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>админ-панель</a> для просмотра данных.
          </p>
        </Card>
      )}
    </div>
  );
}

export default SampleDataPage;
