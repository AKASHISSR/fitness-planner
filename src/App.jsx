import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import ProgramTypePage from './pages/ProgramTypePage';
import QuestionnairePage from './pages/QuestionnairePage';
import Header from './components/Header';
import PaymentPage from './pages/PaymentPage';
import DashboardPageV2 from './pages/DashboardPageV2';
import AboutPage from './pages/AboutPage';
import ReviewsPageV2 from './pages/ReviewsPageV2';
import BlogPage from './pages/BlogPage';
import FAQPageV2 from './pages/FAQPageV2';
import ContactsPage from './pages/ContactsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPageV2 from './pages/AdminPageV2';
import PayPageV2 from './pages/PayPageV2';
import PricesPage from './pages/PricesPage';
import './App.css';
import './styles/mobile-optimization.css';
import './styles/fixed-menu.css'; // Полностью исправленное бургерное меню
import { logVisit } from './firebase';

export const ADMINS = [
  'laptinskii07@gmail.com',
  'Sasha-laptinskii@mail.ru',
  // Добавляй сюда другие email для админов
];

// Экспортируем компоненты из отдельных файлов

// Компонент для защищенных маршрутов
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('fitgenius_user');
  const location = useLocation();

  if (!user) {
    // Сохраняем путь, куда пользователь пытался попасть
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Компонент для админских маршрутов
function AdminRoute({ children }) {
  const userData = localStorage.getItem('fitgenius_user');
  const location = useLocation();
  let userEmail = '';
  
  // Получаем email пользователя из localStorage
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
  
  // Проверяем, является ли пользователь администратором
  const isAdmin = userEmail && ADMINS.some(admin => 
    admin.toLowerCase() === userEmail.toLowerCase()
  );
  
  console.log('AdminRoute проверка:', userEmail, ADMINS, isAdmin);

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

// Компонент для обработки 404
function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a3a2b' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Страница не найдена
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          background: '#4fd165',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Вернуться на главную
      </button>
    </div>
  );
}

function OfferModal({ open, onClose }) {
  const modalRef = useRef();
  if (!open) return null;
  return (
    <div className="offer-modal-overlay" onClick={onClose}>
      <div className="offer-modal" onClick={e => e.stopPropagation()} ref={modalRef}>
        <button className="offer-modal-close" onClick={onClose} aria-label="Закрыть">✕</button>
        <h2>Договор оферты</h2>
        <div className="offer-modal-content">
          <p><b>1. Общие положения</b><br/>
          Настоящий документ является официальным предложением (офертой) ИП Лаптинский Александр Владимирович, УНП 391986581, далее — «Исполнитель», заключить договор на оказание информационных услуг дистанционным способом с любым физическим лицом, далее — «Пользователь», на условиях, изложенных ниже.<br/>
          Акцепт (принятие) условий настоящей оферты осуществляется путем оплаты услуг на сайте.</p>
          <p><b>2. Предмет договора</b><br/>
          Исполнитель предоставляет Пользователю доступ к персональным программам питания и/или тренировок, а также сопутствующим информационным материалам, размещённым на сайте. Услуги оказываются дистанционно, посредством сети Интернет.</p>
          <p><b>3. Права и обязанности сторон</b><br/>
          Исполнитель обязуется: предоставить доступ к выбранным и оплаченным программам; обеспечивать конфиденциальность персональных данных Пользователя.<br/>
          Пользователь обязуется: предоставить достоверные данные при регистрации; не передавать доступ третьим лицам; оплатить услуги в полном объёме.</p>
          <p><b>4. Стоимость и порядок оплаты</b><br/>
          Стоимость услуг указывается на сайте. Оплата производится через платёжные системы, указанные на сайте.</p>
          <p><b>5. Ответственность сторон</b><br/>
          Исполнитель не несёт ответственности за невозможность оказания услуг по причинам, не зависящим от него (технические сбои, действия третьих лиц и пр.). Пользователь несёт ответственность за достоверность предоставленных данных.</p>
          <p><b>6. Возврат средств</b><br/>
          Возврат денежных средств возможен в случаях, предусмотренных законодательством Республики Беларусь.</p>
          <p><b>7. Персональные данные</b><br/>
          Пользователь даёт согласие на обработку своих персональных данных в соответствии с Политикой конфиденциальности.</p>
          <p><b>8. Прочие условия</b><br/>
          Исполнитель вправе вносить изменения в условия оферты без предварительного согласия Пользователя, с обязательной публикацией новой редакции на сайте. Оферта считается заключённой с момента оплаты услуг Пользователем.</p>
          <p><b>9. Реквизиты Исполнителя</b><br/>
          ИП Лаптинский Александр Владимирович<br/>
          УНП 391986581<br/>
          211389, Республика Беларусь, г. Орша, ул. Могилёвская, 99-19<br/>
          E-mail: support@fitgenius.ru<br/>
          Тел.: +375 29 897-52-19</p>
        </div>
      </div>
    </div>
  );
}

function PrivacyModal({ open, onClose }) {
  const modalRef = useRef();
  if (!open) return null;
  return (
    <div className="offer-modal-overlay" onClick={onClose}>
      <div className="offer-modal" onClick={e => e.stopPropagation()} ref={modalRef}>
        <button className="offer-modal-close" onClick={onClose} aria-label="Закрыть">✕</button>
        <h2>Политика конфиденциальности</h2>
        <div className="offer-modal-content">
          <p><b>1. Общие положения</b><br/>
          Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей, которые предоставляет ИП Лаптинский Александр Владимирович (далее — «Оператор») при использовании сайта и сервисов FitGenius.<br/>
          Использование сайта означает согласие пользователя с данной Политикой.</p>
          <p><b>2. Персональные данные, которые обрабатываются</b><br/>
          Оператор может обрабатывать следующие данные:<br/>
          — ФИО, e-mail, номер телефона;<br/>
          — данные, предоставленные при регистрации и заполнении анкет;<br/>
          — сведения о платежах (без хранения платёжных реквизитов);<br/>
          — IP-адрес, данные о браузере, cookies и др.</p>
          <p><b>3. Цели обработки персональных данных</b><br/>
          Оператор обрабатывает персональные данные для:<br/>
          — предоставления доступа к сервису и персональным программам;<br/>
          — обратной связи и поддержки;<br/>
          — выполнения требований законодательства;<br/>
          — улучшения качества сервиса.</p>
          <p><b>4. Передача данных третьим лицам</b><br/>
          Оператор не передает персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством или необходимых для выполнения обязательств (например, платёжные системы).</p>
          <p><b>5. Хранение и защита данных</b><br/>
          Оператор принимает все необходимые меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.<br/>
          Данные хранятся столько, сколько это необходимо для целей обработки.</p>
          <p><b>6. Права пользователя</b><br/>
          Пользователь вправе запросить информацию о своих данных, требовать их исправления или удаления, а также отозвать согласие на обработку.</p>
          <p><b>7. Использование файлов cookie</b><br/>
          Сайт может использовать cookie для улучшения пользовательского опыта. Пользователь может отключить cookie в настройках браузера.</p>
          <p><b>8. Изменения политики</b><br/>
          Оператор вправе вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента публикации на сайте.</p>
          <p><b>9. Контакты</b><br/>
          Оператор: ИП Лаптинский Александр Владимирович<br/>
          E-mail: support@fitgenius.ru<br/>
          Тел.: +375 29 897-52-19</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const [offerOpen, setOfferOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <footer className="main-footer">
      <OfferModal open={offerOpen} onClose={() => setOfferOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <div className="footer-top">
        <div className="footer-block">
          <b>ИП Лаптинский Александр Владимирович</b><br />
          Свидетельство о гос регистрации №391986581, выдано 19.09.2023 Оршанским районным исполнительным комитетом.<br />
          211389, Республика Беларусь, г. Орша, ул. Могилёвская, 99-19.
        </div>
        <div className="footer-block">
          <button className="footer-link" style={{background:'none',border:'none',padding:0,cursor:'pointer'}} onClick={()=>setOfferOpen(true)}>Договор Оферты</button><br />
          <button className="footer-link" style={{background:'none',border:'none',padding:0,cursor:'pointer'}} onClick={()=>setPrivacyOpen(true)}>Политика Конфиденциальности</button>
        </div>
        <div className="footer-block">
          <span style={{fontWeight:600}}>+375 29 897-52-19</span><br />
          <a href="mailto:support@fitgenius.ru" className="footer-link">support@fitgenius.ru</a><br />
        </div>
      </div>
      <div className="footer-pay-logos">
        <img src={`${import.meta.env.BASE_URL}footer-pay-logos.png`} alt="Платёжные системы" className="footer-pay-logos-img" />
      </div>
    </footer>
  );
}

function App() {
  useEffect(() => {
    async function logUserVisit() {
      let ip = '';
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        ip = (await res.json()).ip;
      } catch {}
      const email = localStorage.getItem('fitgenius_user') || null;
      const userAgent = navigator.userAgent;
      const page = window.location.pathname;
      logVisit({ email, ip, userAgent, page });
    }
    logUserVisit();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/choose" element={<ProgramTypePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/pay" element={<PayPageV2 />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPageV2 /></ProtectedRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPageV2 />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FAQPageV2 />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPageV2 /></AdminRoute>} />
        <Route path="/prices" element={<PricesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
