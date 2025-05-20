import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
import './App.css';

const ADMINS = [
  'laptinskii07@gmail.com',
  'Sasha-laptinskii@mail.ru',
  // Добавляй сюда другие email для админов
];

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('fitgenius_theme') || 'light');
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
  const handleLogout = () => {
    localStorage.removeItem('fitgenius_user');
    localStorage.removeItem('fitgenius_paid_type');
    navigate('/');
  };
  return (
    <header className="main-header">
      <nav>
        <div className="main-header-left">
          <ThemeToggle />
          <Link to="/" className="main-logo">Fit<span className="logo-accent">Genius</span></Link>
          {isAdmin && <Link to="/admin" className="main-nav-btn main-admin-btn">Админ</Link>}
        </div>
        <div className="main-nav-links">
          <Link to="/reviews">Отзывы</Link>
          <Link to="/faq">FAQ</Link>
          {user ? (
            <>
              <Link to="/dashboard">Личный кабинет</Link>
              <button onClick={handleLogout} className="main-nav-btn">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/choose" element={<ProgramTypePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
