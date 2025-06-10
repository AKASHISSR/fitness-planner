import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './HomePage.css?v=1.0.1';

function HomePage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);
  const particleContainerRef = useRef(null);
  
  // Функция для открытия модального окна с примером
  const openModal = (imagePath) => {
    setModalImage(imagePath);
    setModalOpen(true);
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
  };
  
  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto'; // Возвращаем прокрутку страницы
  };
  
  // Обработчик нажатия клавиши Escape для закрытия модального окна
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [modalOpen]);
  
  // Настройка Intersection Observer для анимации появления элементов при прокрутке
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.dataset.id]: true }));
        }
      });
    }, { threshold: 0.1 });
    
    // Наблюдаем за всеми элементами с классом 'animate-on-scroll'
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observerRef.current.observe(el);
      });
    }, 100);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  // Функция для создания улучшенного эффекта частиц при движении курсора
  const handleMouseMove = (e) => {
    if (!particleContainerRef.current) return;
    
    // Ограничиваем количество создаваемых частиц для производительности
    if (Math.random() > 0.3) return;
    
    // Создаем новую частицу
    const particle = document.createElement('div');
    const size = Math.random() * 15 + 5;
    const duration = Math.random() * 2 + 1;
    
    // Выбираем случайную форму с большим весом для красивых форм
    const shapes = ['circle', 'circle', 'star', 'triangle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Устанавливаем стили частицы
    particle.className = `particle ${shape}`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${e.pageX}px`;
    particle.style.top = `${e.pageY}px`;
    
    // Улучшенная цветовая гамма в зеленых тонах с учетом текущей темы
    const colors = [
      'var(--primary)', 'var(--primary-dark)', 'var(--primary-light)', 
      'rgba(79, 209, 101, 0.7)', 'rgba(54, 177, 78, 0.8)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    
    // Добавляем частицу в контейнер
    particleContainerRef.current.appendChild(particle);
    
    // Анимируем движение частицы с улучшенной анимацией
    setTimeout(() => {
      const randomX = (Math.random() - 0.5) * 100;
      const randomY = (Math.random() - 0.5) * 100;
      const randomRotate = Math.random() * 360;
      particle.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${Math.random() * 0.5 + 0.8})`;
      particle.style.opacity = '0';
      particle.style.filter = `blur(${Math.random() * 2 + 1}px)`;
    }, 10);
    
    // Удаляем частицу после анимации
    setTimeout(() => {
      if (particleContainerRef.current && particleContainerRef.current.contains(particle)) {
        particle.remove();
      }
    }, duration * 1000);
  };
  
  // Функция для создания фоновых частиц, которые появляются автоматически
  useEffect(() => {
    const createBackgroundParticles = () => {
      if (!particleContainerRef.current) return;
      
      const particle = document.createElement('div');
      const size = Math.random() * 10 + 3;
      const duration = Math.random() * 5 + 3;
      
      // Случайная позиция на экране
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * 500; // Ограничиваем высоту появления частиц
      
      // Выбираем форму
      const shapes = ['circle', 'star', 'triangle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Устанавливаем стили
      particle.className = `particle ${shape} background-particle`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.opacity = '0';
      
      // Цвет с учетом темы
      const colors = [
        'var(--primary)', 'var(--primary-dark)', 'var(--primary-light)', 
        'rgba(79, 209, 101, 0.5)', 'rgba(54, 177, 78, 0.6)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.backgroundColor = color;
      
      particleContainerRef.current.appendChild(particle);
      
      // Начальная анимация
      setTimeout(() => {
        particle.style.opacity = '0.6';
        const moveY = Math.random() * 200 + 100;
        const moveX = (Math.random() - 0.5) * 100;
        particle.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${Math.random() * 360}deg)`;
      }, 10);
      
      // Удаляем частицу
      setTimeout(() => {
        if (particleContainerRef.current && particleContainerRef.current.contains(particle)) {
          particle.remove();
        }
      }, duration * 1000);
    };
    
    // Создаем фоновые частицы с интервалом
    const intervalId = setInterval(createBackgroundParticles, 300);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home-bg">
      {/* Героический блок с анимированным фоном */}
      <header className="home-hero" onMouseMove={handleMouseMove}>
        <div className="cursor-effect-container" ref={particleContainerRef}></div>
        <div className="hero-content" data-id="hero">
          <h1 className="hero-title visible">
            Персональные программы питания и тренировок с гарантией результата
          </h1>
          <p className="hero-subtitle visible">
            Достигайте своих целей с индивидуальным планом, разработанным специально для вас
          </p>
          <div className="hero-cta visible">
            <div className="top-buttons-row">
              <button className="cta-button primary" onClick={() => navigate('/questionnaire?type=food')}>
                Программа питания
              </button>
              <button className="cta-button secondary" onClick={() => navigate('/questionnaire?type=workout')}>
                Программа тренировок
              </button>
            </div>
            <button className="cta-button combo premium" onClick={() => navigate('/questionnaire?type=combo')}>
              <span className="premium-star">★</span> Комплексная программа <span className="premium-star">★</span>
            </button>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-icon"></div>
          <span>Прокрутите вниз</span>
        </div>
      </header>

      {/* Секция преимуществ */}
      <section className="home-benefits">
        <div className="section-container">
          <h2 className="section-title animate-on-scroll" data-id="benefits-title">Почему выбирают FitGenius?</h2>
          <div className="benefits-grid">
            <div className={`benefit-card animate-on-scroll ${isVisible['benefit1'] ? 'visible' : ''}`} data-id="benefit1">
              <div className="benefit-icon">
                <span role="img" aria-label="персонализация">🎯</span>
              </div>
              <h3>Индивидуальный подход</h3>
              <p>Программы, адаптированные под ваши параметры, цели и предпочтения</p>
            </div>
            <div className={`benefit-card animate-on-scroll ${isVisible['benefit2'] ? 'visible' : ''}`} data-id="benefit2">
              <div className="benefit-icon">
                <span role="img" aria-label="наука">🧪</span>
              </div>
              <h3>Научный подход</h3>
              <p>Программы основаны на современных исследованиях в области питания и тренировок</p>
            </div>
            <div className={`benefit-card animate-on-scroll ${isVisible['benefit3'] ? 'visible' : ''}`} data-id="benefit3">
              <div className="benefit-icon">
                <span role="img" aria-label="время">⏱️</span>
              </div>
              <h3>Экономия времени</h3>
              <p>Готовый план без необходимости самостоятельного составления и расчетов</p>
            </div>
            <div className={`benefit-card animate-on-scroll ${isVisible['benefit4'] ? 'visible' : ''}`} data-id="benefit4">
              <div className="benefit-icon">
                <span role="img" aria-label="результат">📈</span>
              </div>
              <h3>Гарантированный результат</h3>
              <p>Проверенные методики, которые приводят к желаемым изменениям</p>
            </div>
          </div>
        </div>
      </section>

      {/* Секция примеров программ */}
      <section className="home-examples">
        <div className="section-container">
          <h2 className="section-title animate-on-scroll" data-id="examples-title">Примеры программ</h2>
          <div className="examples-grid">
            <div className={`example-card animate-on-scroll ${isVisible['example1'] ? 'visible' : ''}`} data-id="example1">
              <div className="example-header">
                <div className="example-icon">
                  <span role="img" aria-label="питание">🍎</span>
                </div>
                <h3>Рацион для похудения</h3>
              </div>
              <p className="example-desc">Сбалансированное меню на неделю, учитывающее ваши предпочтения и цели.</p>
              <button className="example-btn" onClick={() => openModal('./example-food-day.png')}>
                Посмотреть пример
              </button>
            </div>
            
            <div className={`example-card animate-on-scroll ${isVisible['example2'] ? 'visible' : ''}`} data-id="example2">
              <div className="example-header">
                <div className="example-icon">
                  <span role="img" aria-label="тренировка">💪</span>
                </div>
                <h3>План тренировок</h3>
              </div>
              <p className="example-desc">Эффективные упражнения с учетом вашего уровня и доступного инвентаря.</p>
              <button className="example-btn" onClick={() => openModal('./example-workout-day.png')}>
                Посмотреть пример
              </button>
            </div>
            
            <div className={`example-card animate-on-scroll ${isVisible['example3'] ? 'visible' : ''}`} data-id="example3">
              <div className="example-header">
                <div className="example-icon">
                  <span role="img" aria-label="комплекс">⚡</span>
                </div>
                <h3>Комплексная программа</h3>
              </div>
              <p className="example-desc">Максимальный результат — синергия рациона и физической активности.</p>
              <button className="example-btn special-btn" onClick={() => navigate('/questionnaire?type=combo')}>
                Создать комплекс
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Секция призыва к действию */}
      <section className="home-cta-section">
        <div className="section-container">
          <div className={`cta-content animate-on-scroll ${isVisible['cta-section'] ? 'visible' : ''}`} data-id="cta-section">
            <h2>Готовы начать свой путь к здоровому образу жизни?</h2>
            <p>Ответьте на несколько вопросов и получите персональную программу уже сегодня</p>
            <button className="cta-button primary large" onClick={() => navigate('/questionnaire?type=combo')}>
              Пройти опрос
            </button>
          </div>
        </div>
      </section>

      {/* Модальное окно для просмотра примеров */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img src={modalImage} alt="Пример программы" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage; 