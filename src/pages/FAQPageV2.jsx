import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQPageV2-enhanced.css?v=1.3.0';

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

// Компонент для элемента аккордеона
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <motion.div 
      className={`faq-item ${isOpen ? 'active' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="faq-question" onClick={toggleOpen}>
        <div className="faq-question-text">{question}</div>
        <motion.div 
          className="faq-icon"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="faq-answer-content">
              {typeof answer === 'string' ? (
                <p>{answer}</p>
              ) : (
                answer
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function FAQPageV2() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  // Данные для FAQ
  const faqItems = [
    {
      question: "Что такое FitGenius?",
      answer: "FitGenius — это онлайн-сервис, который за считанные минуты подберёт для вас индивидуальную программу питания и тренировок, полностью под ваши цели, параметры и образ жизни."
    },
    {
      question: "В чём польза сайта?",
      answer: (
        <>
          <ul>
            <li><b>Экономия времени:</b> не нужно часами искать диеты и тренировки — всё подбирается автоматически.</li>
            <li><b>Персонализация:</b> учитываются ваши цели, предпочтения, аллергии, бюджет, опыт и даже доступный инвентарь.</li>
            <li><b>Научный подход:</b> алгоритмы основаны на современных принципах нутрициологии и спортивной физиологии.</li>
            <li><b>Гибкость:</b> можно скорректировать программу после получения, попробовать разные варианты.</li>
            <li><b>Всё в одном месте:</b> меню, список покупок, тренировки, заметки, экспорт в PDF, подписка на обновления.</li>
          </ul>
        </>
      )
    },
    {
      question: "Для кого этот сервис?",
      answer: (
        <>
          <ul>
            <li>Для тех, кто хочет похудеть, набрать массу или просто быть в тонусе.</li>
            <li>Для занятых людей, которым важно быстро получать готовые решения.</li>
            <li>Для новичков и опытных — вопросы и планы адаптируются под ваш уровень.</li>
            <li>Для всех, кто ценит здоровье и хочет получать результат с удовольствием!</li>
          </ul>
        </>
      )
    },
    {
      question: "Как это работает?",
      answer: (
        <>
          <ol>
            <li>Вы отвечаете на короткий опрос.</li>
            <li>Выбираете нужную услугу (питание, тренировки или комбо).</li>
            <li>Оплачиваете — и в ваш личный кабинет будет добавлена индивидуальная программа, составленная на основе вашего опроса.</li>
            <li>Пользуетесь, корректируете, экспортируете, делитесь с друзьями!</li>
          </ol>
        </>
      )
    },
    {
      question: "Почему стоит доверять FitGenius?",
      answer: (
        <>
          <ul>
            <li>Гарантия возврата денег, если программа не подойдёт.</li>
            <li>Возможность бесплатной корректировки параметров.</li>
            <li>Постоянная поддержка и обновления.</li>
            <li>Партнёрские скидки и бонусы для постоянных клиентов.</li>
          </ul>
        </>
      )
    },
    {
      question: "Какие программы питания предлагает FitGenius?",
      answer: "FitGenius предлагает разнообразные программы питания, адаптированные под ваши цели: для похудения, набора мышечной массы, поддержания веса, вегетарианские, безглютеновые и многие другие. Все программы учитывают ваши предпочтения, аллергии и доступный бюджет."
    },
    {
      question: "Как часто обновляются тренировочные программы?",
      answer: "Тренировочные программы обновляются каждые 4-6 недель, чтобы обеспечить постоянный прогресс и избежать эффекта плато. Вы также можете запросить обновление программы в любое время, если чувствуете, что готовы к новым вызовам."
    }
  ];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Введите корректный email');
      return;
    }
    setError('');
    const feedback = JSON.parse(localStorage.getItem('fitgenius_feedback') || '[]');
    feedback.push({ ...form, date: new Date().toLocaleString() });
    localStorage.setItem('fitgenius_feedback', JSON.stringify(feedback));
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="faq-bg">
      <AnimatedBackground />
      
      <motion.div 
        className="faq-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="faq-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Часто задаваемые вопросы
        </motion.h1>
        
        <motion.p 
          className="faq-subheading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Узнайте больше о том, как FitGenius поможет вам достичь ваших целей в фитнесе и правильном питании
        </motion.p>
        
        <div className="faq-accordion">
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index} 
              question={item.question} 
              answer={item.answer} 
              index={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="feedback-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="feedback-header">
            <div className="feedback-icon">💬</div>
            <h2 className="feedback-heading">Остались вопросы?</h2>
            <p className="feedback-subheading">Напишите нам, и мы с радостью ответим на все ваши вопросы в течение 24 часов</p>
          </div>
          
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="label-icon">👤</span>
                  Ваше имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Как к вам обращаться?"
                  value={form.name}
                  onChange={handleChange}
                  className="feedback-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  Email для ответа
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className="feedback-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message" className="form-label">
                <span className="label-icon">✍️</span>
                Ваш вопрос или сообщение
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Опишите ваш вопрос подробно. Чем больше информации, тем точнее мы сможем помочь!"
                value={form.message}
                onChange={handleChange}
                className="feedback-textarea"
                rows="5"
                required
              />
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="feedback-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="error-icon">❌</span> 
                  <span>{error}</span>
                </motion.div>
              )}
              
              {sent && (
                <motion.div 
                  className="feedback-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="success-icon">🎉</span> 
                  <span>Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время!</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button 
              type="submit" 
              className="feedback-btn"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 12px 30px rgba(79, 209, 101, 0.4)',
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span className="btn-icon">🚀</span>
              Отправить сообщение
            </motion.button>
          </form>
          
          <div className="feedback-footer">
            <p className="feedback-contact-info">
              <span className="contact-icon">📞</span>
              Или напишите нам на <a href="mailto:support@fitgenius.ru">support@fitgenius.ru</a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default FAQPageV2;
