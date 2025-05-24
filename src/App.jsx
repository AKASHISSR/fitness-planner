import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import ProgramTypePage from './pages/ProgramTypePage';
import QuestionnairePage from './pages/QuestionnairePage';
import PaymentPage from './pages/PaymentPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ReviewsPage from './pages/ReviewsPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ContactsPage from './pages/ContactsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import PayPage from './pages/PayPage';
import './App.css';
import { logVisit } from './firebase';

const ADMINS = [
  'laptinskii07@gmail.com',
  'Sasha-laptinskii@mail.ru',
  // Добавляй сюда другие email для админов
];

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('fitgenius_theme') || 'dark');
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('fitgenius_theme', theme);
  }, [theme]);
  return (
    <button className="theme-toggle-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Сменить тему">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

function Header() {
  const user = localStorage.getItem('fitgenius_user');
  const navigate = useNavigate();
  const isAdmin = user && ADMINS.includes(user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('fitgenius_user');
    localStorage.removeItem('fitgenius_paid_type');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="main-header">
      <nav>
        <div className="main-header-left">
          <ThemeToggle />
          <Link to="/" className="main-logo">Fit<span className="logo-accent">Genius</span></Link>
          {isAdmin && <Link to="/admin" className="main-nav-btn main-admin-btn">Админ</Link>}
        </div>
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} title="Меню">
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <div className={`main-nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {/* Кнопка закрытия меню — теперь первой внутри меню */}
          {isMobileMenuOpen && (
            <button
              className="mobile-menu-close-btn"
              onClick={toggleMobileMenu}
              aria-label="Закрыть меню"
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: 'var(--menu-close-bg, #fff)',
                color: 'var(--menu-close-color, #1a3a2b)',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                fontSize: 24,
                fontWeight: 700,
                boxShadow: '0 2px 8px #0002',
                cursor: 'pointer',
                zIndex: 1002
              }}
            >
              ✕
            </button>
          )}
          <Link to="/reviews" onClick={() => setIsMobileMenuOpen(false)}>Отзывы</Link>
          <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Личный кабинет</Link>
              <button onClick={handleLogout} className="main-nav-btn">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Войти</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Регистрация</Link>
            </>
          )}
        </div>
        {isMobileMenuOpen && <div className="mobile-menu-overlay active" onClick={toggleMobileMenu}></div>}
      </nav>
    </header>
  );
}

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
  const user = localStorage.getItem('fitgenius_user');
  const location = useLocation();
  const isAdmin = user && ADMINS.includes(user);

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

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-block">
          <b>ИП Лаптинский Александр Владимирович</b><br />
          Свидетельство о гос регистрации №391986581, выдано 19.09.2023 Оршанским районным исполнительным комитетом.<br />
          211389, Республика Беларусь, г. Орша, ул. Могилёвская, 99-19.
        </div>
        <div className="footer-block">
          <a href="#" className="footer-link">Договор Оферты</a><br />
          <a href="#" className="footer-link">Политика Конфиденциальности</a>
        </div>
        <div className="footer-block">
          <span style={{fontWeight:600}}>+375 29 897-52-19</span><br />
          <a href="mailto:support@fitgenius.ru" className="footer-link">support@fitgenius.ru</a><br />
        </div>
      </div>
      <div className="footer-pay-logos">
        <img src="footer-pay-logos.png" alt="Платёжные системы" className="footer-pay-logos-img" />
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
        <Route path="/pay" element={<PayPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
