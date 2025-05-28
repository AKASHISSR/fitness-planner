import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './PricesPage.css';

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

// Компонент для отображения преимуществ тарифа
const TariffFeatures = ({ features }) => {
  return (
    <ul className="tariff-features">
      {features.map((feature, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="tariff-feature"
        >
          <span className="feature-check">✓</span> {feature}
        </motion.li>
      ))}
    </ul>
  );
};



function PricesPage() {
  const [selected, setSelected] = useState('combo');
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  
  const tariffs = [
    {
      id: 'food',
      title: 'Программа питания на неделю',
      price: 20,
      oldPrice: null,
      desc: 'Персональное меню на 7 дней, список покупок, рекомендации по питанию.',
      features: [
        'Индивидуальный расчет калорий',
        'Учет пищевых предпочтений',
        'Список продуктов для закупки',
        'Рецепты и инструкции на 7 дней',
      ],
      icon: '🥗'
    },
    {
      id: 'workout',
      title: 'Программа тренировок на неделю',
      price: 30,
      oldPrice: null,
      desc: 'План тренировок на 7 дней, упражнения и рекомендации.',
      features: [
        'Персональный план тренировок',
        'Подробные описания упражнений',
        'Отслеживание прогресса на неделю',
        'Адаптация под ваш уровень',
      ],
      icon: '💪'
    },
    {
      id: 'combo',
      title: 'Комбо: питание + тренировки на неделю',
      price: 40,
      oldPrice: 50,
      desc: 'Всё включено: рацион и тренировки на 7 дней для максимального результата.',
      features: [
        'Синхронизированные планы на неделю',
        'Максимальная эффективность',
        'Приоритетная поддержка',
        'Доступ к премиум-контенту',
        'Выгоднее, чем покупать по отдельности',
      ],
      highlight: true,
      icon: '🔥',
      savingInfo: 'Экономия 10 руб. по сравнению с покупкой по отдельности'
    },
  ];
  
  const selectedTariff = tariffs.find(t => t.id === selected);
  
  const handleStartQuestionnaire = () => {
    setShowConfetti(true);
    setTimeout(() => navigate(`/questionnaire?type=${selected}`), 1500);
  };

  return (
    <div className="prices-bg">
      <AnimatedBackground />
      
      <motion.div 
        className="prices-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="prices-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Цены и оплата
        </motion.h1>
        
        <motion.p 
          className="prices-subheading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Выберите подходящий тариф и начните путь к здоровому образу жизни с FitGenius
        </motion.p>
        
        <div className="prices-tariffs">
          {tariffs.map((tariff, index) => (
            <motion.div
              key={tariff.id}
              className={`prices-tariff ${selected === tariff.id ? 'selected' : ''} ${tariff.highlight ? 'highlight' : ''}`}
              onClick={() => setSelected(tariff.id)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              {tariff.highlight && (
                <div className="prices-badge">
                  <span>Выгодно! Экономия 20%</span>
                </div>
              )}
              
              <div className="tariff-icon">{tariff.icon}</div>
              <h3 className="prices-title">{tariff.title}</h3>
              <p className="prices-desc">{tariff.desc}</p>
              
              <div className="prices-price">
                {tariff.oldPrice && (
                  <span className="old-price">{tariff.oldPrice} руб.</span>
                )}
                <span className="current-price">{tariff.price} руб.</span>
                {tariff.savingInfo && (
                  <div className="saving-info">{tariff.savingInfo}</div>
                )}
              </div>
              
              <TariffFeatures features={tariff.features} />
              
              <motion.button 
                className={`tariff-select-btn ${selected === tariff.id ? 'selected' : ''} ${tariff.highlight ? 'highlight-btn' : ''}`}
                whileHover={{ scale: 1.05, boxShadow: tariff.highlight ? '0 10px 25px rgba(79, 209, 101, 0.4)' : '0 5px 15px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(tariff.id);
                }}
                initial={tariff.highlight ? { y: [0, -5, 0], transition: { repeat: 3, duration: 0.6 } } : {}}
                animate={tariff.highlight ? { 
                  boxShadow: ['0 5px 15px rgba(79, 209, 101, 0.2)', '0 8px 25px rgba(79, 209, 101, 0.4)', '0 5px 15px rgba(79, 209, 101, 0.2)'],
                  transition: { repeat: Infinity, duration: 2, repeatType: 'reverse' }
                } : {}}
              >
                {selected === tariff.id ? 'Выбрано' : tariff.highlight ? 'Выбрать выгодно!' : 'Выбрать'}
              </motion.button>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="prices-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="summary-details">
            <h3>Ваш выбор:</h3>
            <div className="selected-tariff">
              <span className="selected-icon">{selectedTariff.icon}</span>
              <span className="selected-title">{selectedTariff.title}</span>
              <span className="selected-price">{selectedTariff.price} руб.</span>
            </div>
          </div>
          
          <motion.button 
            className="prices-button highlight-main-btn"
            onClick={handleStartQuestionnaire}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(79, 209, 101, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -5, 0],
              boxShadow: ['0 5px 15px rgba(79, 209, 101, 0.3)', '0 10px 30px rgba(79, 209, 101, 0.5)', '0 5px 15px rgba(79, 209, 101, 0.3)'],
              transition: { repeat: Infinity, duration: 2, repeatType: 'reverse' }
            }}
          >
            <span className="btn-icon">✨</span> Выбрать выгодный тариф <span className="btn-icon">✨</span>
          </motion.button>
        </motion.div>
        
        <div className="prices-steps">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Как это работает
          </motion.h2>
          
          <div className="steps-container">
            <motion.div 
              className="step-item"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="step-number">1</div>
              <h3>Выберите тариф</h3>
              <p>Выберите подходящий вам тариф из предложенных вариантов</p>
            </motion.div>
            
            <motion.div 
              className="step-item"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="step-number">2</div>
              <h3>Заполните анкету</h3>
              <p>Ответьте на несколько вопросов для создания персональной программы</p>
            </motion.div>
            
            <motion.div 
              className="step-item"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="step-number">3</div>
              <h3>Оплатите заказ</h3>
              <p>Безопасная оплата с помощью любой банковской карты или электронного кошелька</p>
            </motion.div>
            
            <motion.div 
              className="step-item"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="step-number">4</div>
              <h3>Получите результат</h3>
              <p>Доступ к персональной программе в личном кабинете</p>
            </motion.div>
          </div>
        </div>
        

        
        <motion.div 
          className="prices-guarantee"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="guarantee-item">
            <span className="guarantee-icon">🔒</span>
            <span>Безопасная оплата</span>
          </div>
          <div className="guarantee-item">
            <span className="guarantee-icon">💸</span>
            <span>Гарантия возврата в течение 7 дней</span>
          </div>
          <div className="guarantee-item">
            <span className="guarantee-icon">🛠</span>
            <span>Техническая поддержка 24/7</span>
          </div>
        </motion.div>
        
        <div className="prices-support">
          Остались вопросы? <a href="mailto:support@fitgenius.ru">support@fitgenius.ru</a>
        </div>
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
}

export default PricesPage; 