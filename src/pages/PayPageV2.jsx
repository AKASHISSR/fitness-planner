import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logUserActivity } from '../firebase';
import './PayPageV2-enhanced.css?v=1.3.0';

// Тарифы с ценами и описаниями в соответствии со страницей Цены и оплата
const TARIFFS = {
  food: { 
    name: 'Программа питания на неделю', 
    price: 20, 
    oldPrice: null,
    icon: '🥗',
    description: 'Персональное меню на 7 дней, список покупок, рекомендации по питанию.'
  },
  workout: { 
    name: 'Программа тренировок на неделю', 
    price: 30, 
    oldPrice: null,
    icon: '💪',
    description: 'План тренировок на 7 дней, упражнения, видео и советы.'
  },
  combo: { 
    name: 'Комбо: питание + тренировки на неделю', 
    price: 40, 
    oldPrice: 50,
    icon: '🔥',
    description: 'Всё включено: рацион и тренировки на 7 дней для максимального результата.',
    discount: 'Экономия 10 руб.'
  },
};

// Компонент для анимированного фона
const AnimatedBackground = () => {
  return (
    <div className="pay-bg">
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          className="pay-particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Компонент методов оплаты
const PaymentMethods = () => {
  return (
    <div className="pay-methods">
      <div className="pay-methods-title">Принимаем к оплате</div>
      <div className="pay-methods-icons">
        <div className="pay-method-icon pay-method-visa"></div>
        <div className="pay-method-icon pay-method-mastercard"></div>
        <div className="pay-method-icon pay-method-mir"></div>
        <div className="pay-method-icon pay-method-applepay"></div>
        <div className="pay-method-icon pay-method-googlepay"></div>
      </div>
    </div>
  );
};

// Компонент гарантий
const Guarantees = () => {
  return (
    <div className="pay-guarantees">
      <div className="pay-guarantee-item">
        <span className="pay-guarantee-icon">🔒</span>
        <span>Безопасная оплата</span>
      </div>
      <div className="pay-guarantee-item">
        <span className="pay-guarantee-icon">💸</span>
        <span>Гарантия возврата</span>
      </div>
      <div className="pay-guarantee-item">
        <span className="pay-guarantee-icon">🛠</span>
        <span>Поддержка 24/7</span>
      </div>
    </div>
  );
};

function PayPageV2() {
  const navigate = useNavigate();
  const [type, setType] = useState('food');
  const [tariff, setTariff] = useState(TARIFFS.food);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('fitgenius_selected_type') || 'food';
    setType(t);
    setTariff(TARIFFS[t] || TARIFFS.food);
  }, []);

  const handlePay = async () => {
    setLoading(true);
    
    // Показываем конфетти
    setShowConfetti(true);
    
    // Имитация процесса оплаты
    setTimeout(async () => {
      try {
        // Сохраняем тип оплаченного тарифа
        localStorage.setItem('fitgenius_paid_type', type);
        
        // Логируем покупку
        const userData = localStorage.getItem('fitgenius_user') || '';
        let userEmail = '';
        
        // Обработка данных пользователя
        if (userData) {
          try {
            // Проверяем, если это JSON строка
            if (userData.startsWith('{')) {
              const parsedData = JSON.parse(userData);
              if (parsedData.email) {
                userEmail = parsedData.email;
              }
            } else if (userData.includes('@')) {
              // Просто email строка
              userEmail = userData;
            }
          } catch (error) {
            console.error('Ошибка при парсинге данных пользователя:', error);
            userEmail = userData;
          }
        }
        
        // Логируем активность
        await logUserActivity({ 
          email: userEmail, 
          type: 'purchase', 
          desc: `Оплачен тариф: ${tariff.name} (${tariff.price} руб.)` 
        });
        
        // Задержка для отображения конфетти
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Ошибка при обработке оплаты:', error);
        setLoading(false);
        setShowConfetti(false);
        // Здесь можно добавить обработку ошибок
      }
    }, 1200);
  };

  return (
    <div className="pay-page-container">
      <AnimatedBackground />
      
      <motion.div
        className="pay-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Шапка карточки */}
        <div className="pay-card-header">
          <div className="pay-card-decoration"></div>
          <div className="pay-card-decoration"></div>
          
          <motion.h1 
            className="pay-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Оплата
          </motion.h1>
          
          <motion.p 
            className="pay-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Ваш персональный план уже готов!
          </motion.p>
        </div>
        
        {/* Тело карточки */}
        <div className="pay-card-body">
          <div className="pay-info">
            <motion.div 
              className="pay-tariff"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="pay-tariff-icon">
                {tariff.icon}
              </div>
              
              <div className="pay-tariff-details">
                <div className="pay-tariff-name">{tariff.name}</div>
                <div className="pay-tariff-description">{tariff.description}</div>
                <div className="pay-price-container">
                  {tariff.oldPrice && <span className="pay-old-price">{tariff.oldPrice} руб.</span>}
                  <span className="pay-current-price">{tariff.price} руб.</span>
                  {tariff.discount && <span className="pay-discount-badge">{tariff.discount}</span>}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="pay-total"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="pay-total-label">Сумма к оплате:</div>
              <div className="pay-total-price">{tariff.price} руб.</div>
            </motion.div>
          </div>
          
          <motion.button 
            className="pay-button"
            onClick={handlePay}
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: ['0 5px 15px rgba(79, 209, 101, 0.3)', '0 10px 25px rgba(79, 209, 101, 0.5)', '0 5px 15px rgba(79, 209, 101, 0.3)'],
            }}
            transition={{ 
              opacity: { delay: 0.6, duration: 0.5 },
              y: { delay: 0.6, duration: 0.5 },
              boxShadow: { repeat: Infinity, duration: 2, repeatType: 'reverse' }
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 10px 25px rgba(79, 209, 101, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="pay-button-icon">✨</span>
            {loading ? 'Обработка оплаты...' : 'Оплатить'}
            <span className="pay-button-icon">✨</span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <PaymentMethods />
            <Guarantees />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Конфетти для анимации успешной оплаты */}
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

export default PayPageV2;
