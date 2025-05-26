import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  
  const openModal = (imagePath) => {
    setModalImage(imagePath);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  // Функция для создания улучшенного эффекта партиклей при движении курсора
  const handleMouseMove = (e) => {
    const container = document.querySelector('.cursor-effect-container');
    if (!container) return;
    
    // Создаем новую частицу
    const particle = document.createElement('div');
    const size = Math.random() * 20 + 8; // Увеличенный размер частиц
    const duration = Math.random() * 2 + 1.5; // Увеличенная длительность
    
    // Выбираем случайную форму с большим весом для красивых форм
    const shapes = ['circle', 'circle', 'star', 'star', 'triangle', 'square'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Устанавливаем стили частицы
    particle.className = `particle ${shape}`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${e.pageX}px`;
    particle.style.top = `${e.pageY}px`;
    
    // Улучшенная цветовая гамма в зеленых тонах
    const colors = [
      '#4fd165', '#36b14e', '#1a3a2b', '#e6f7ea', 
      'rgba(79, 209, 101, 0.7)', 'rgba(54, 177, 78, 0.8)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    
    // Добавляем частицу в контейнер
    container.appendChild(particle);
    
    // Анимируем движение частицы с улучшенной анимацией
    setTimeout(() => {
      const randomX = (Math.random() - 0.5) * 120;
      const randomY = (Math.random() - 0.5) * 120;
      const randomRotate = Math.random() * 720 - 360; // Более выраженное вращение
      particle.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${Math.random() * 0.5 + 0.8})`;
      particle.style.opacity = '0';
      particle.style.filter = `blur(${Math.random() * 2 + 1}px)`;
    }, 10);
    
    // Удаляем частицу после анимации
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  };

  return (
    <div className="home-bg">
      <header className="home-header" onMouseMove={handleMouseMove}>
        <div className="cursor-effect-container"></div>
        <h1>Персональные программы питания и тренировок с гарантией результата</h1>
        <p className="home-subtitle">Ответьте на вопросы – получите идеальный рацион и план занятий под ваши цели</p>
        <div className="home-cta">
          <button onClick={() => navigate('/questionnaire?type=food')}>Создать программу питания</button>
          <button onClick={() => navigate('/questionnaire?type=workout')}>Создать программу тренировок</button>
          <button className="combo" onClick={() => navigate('/questionnaire?type=combo')}>Питание + Тренировки (комбо)</button>
        </div>
      </header>
      <section className="home-benefits">
        <h2>Почему выбирают нас?</h2>
        <div className="benefits-list">
          <div className="benefit">
            <span role="img" aria-label="user">👤</span>
            <p>Персонализация под ваши параметры</p>
          </div>
          <div className="benefit">
            <span role="img" aria-label="clock">⏱️</span>
            <p>Экономия времени на планирование</p>
          </div>
          <div className="benefit">
            <span role="img" aria-label="science">🔬</span>
            <p>Научный подход</p>
          </div>
        </div>
      </section>
      <section className="home-examples">
        <h2>Примеры программ</h2>
        <div className="examples-list">
          <div className="example">
            <div className="example-header">
              <div className="example-icon">🍔</div>
              <h3>Рацион для похудения</h3>
            </div>
            <p className="example-desc">Сбалансированное меню на неделю, учитывающее ваши предпочтения и цели.</p>
            <div className="example-img-container">
              <img src="/dist/example-food-day.png" alt="Пример рациона" className="example-img" />
            </div>
            <button className="example-btn" onClick={() => openModal('/dist/example-food-day.png')}>Пример</button>
          </div>
          
          <div className="example">
            <div className="example-header">
              <div className="example-icon">🏃</div>
              <h3>План тренировок</h3>
            </div>
            <p className="example-desc">Эффективные упражнения с учетом вашего уровня и доступного инвентаря.</p>
            <div className="example-img-container">
              <img src="/dist/example-workout-day.png" alt="Пример тренировки" className="example-img" />
            </div>
            <button className="example-btn" onClick={() => openModal('/dist/example-workout-day.png')}>Пример</button>
          </div>
          
          <div className="example">
            <div className="example-header">
              <div className="example-icon">⚡</div>
              <h3>Комплекс: питание + тренировки</h3>
            </div>
            <p className="example-desc">Максимальный результат — синергия рациона и физической активности.</p>
            <button className="example-btn special-btn" onClick={() => navigate('/questionnaire?type=combo')}>Создать комплекс</button>
          </div>
        </div>
      </section>
      {/* Модальное окно для просмотра примеров */}
      {modalOpen && (
        <div className="example-modal-overlay" onClick={closeModal}>
          <div className="example-modal" onClick={(e) => e.stopPropagation()}>
            <button className="example-modal-close" onClick={closeModal}>×</button>
            <img src={modalImage} alt="Пример программы" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage; 