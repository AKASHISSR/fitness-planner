import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import HomePage from './pages/HomePage';
import ProgramTypePage from './pages/ProgramTypePage';
import QuestionnairePage from './pages/QuestionnairePage';
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
import './styles/mobile-menu.css';
import { logVisit } from './firebase';

export const ADMINS = [
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
    <button 
      className="theme-toggle-btn" 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
      title="Сменить тему"
      aria-label="Сменить тему"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

function Header() {
  // Получаем данные пользователя
  const userEmail = localStorage.getItem('fitgenius_user');
  const userName = localStorage.getItem('fitgenius_name');
  const navigate = useNavigate();
  
  // Проверка прав администратора (с учетом разных форматов хранения данных)
  const isAdmin = userEmail && ADMINS.some(admin => {
    // Проверяем, является ли userEmail JSON-объектом
    try {
      const userObj = JSON.parse(userEmail);
      return userObj.email && admin.toLowerCase() === userObj.email.toLowerCase();
    } catch {
      // Если не JSON, сравниваем строки напрямую
      return admin.toLowerCase() === userEmail.toLowerCase();
    }
  });
  
  // Состояния
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Рефы
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const touchStartX = useRef(null);

  // Обработчик прокрутки для эффекта прозрачности шапки
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Обработчик свайпа для закрытия мобильного меню
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current || !mobileMenuRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    
    // Если свайп вправо, двигаем меню
    if (diff > 0) {
      mobileMenuRef.current.style.transform = `translateX(${diff}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !mobileMenuRef.current) return;
    
    const currentX = e.changedTouches[0].clientX;
    const diff = currentX - touchStartX.current;
    
    // Возвращаем меню в исходное положение или закрываем
    if (diff > 70) { // Если свайп был достаточно длинным
      setIsMobileMenuOpen(false);
    } else {
      mobileMenuRef.current.style.transform = '';
    }
    
    touchStartX.current = null;
  };

  // Закрытие меню при клике на оверлей
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('mobile-menu-overlay')) {
      setIsMobileMenuOpen(false);
    }
  };

  // Блокировка прокрутки при открытом меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Обработчик выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('fitgenius_user');
    localStorage.removeItem('fitgenius_name');
    localStorage.removeItem('fitgenius_paid_type');
    localStorage.removeItem('fitgenius_meal_plan');
    localStorage.removeItem('fitgenius_workout_plan');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Переключение мобильного меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Закрытие меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`} ref={headerRef}>
      <nav>
        <div className="main-header-left">
          <ThemeToggle />
          <Link to="/" className="main-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15 8.5C15 8.5 13.5 9.5 12 9.5C10.5 9.5 9 8.5 9 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8.5 14C8.5 14 9.5 16 12 16C14.5 16 15.5 14 15.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-fit">Fit</span>
              <span className="logo-genius">Genius</span>
            </div>
          </Link>
        </div>

        {/* Десктопная навигация */}
        <div className="desktop-nav-links">
          <Link to="/" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Главная</span>
          </Link>
          
          <Link to="/prices" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
              <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
            </svg>
            <span>Цены и оплата</span>
          </Link>
          
          <Link to="/reviews" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
              <path d="M12 15L13.57 11.57L17 10L13.57 8.43L12 5L10.43 8.43L7 10L10.43 11.57L12 15Z" fill="currentColor"/>
            </svg>
            <span>Отзывы</span>
          </Link>
          
          <Link to="/faq" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
              <path d="M11.07 12.85C11.07 12.85 11.07 13.8 11.07 14.75C11.07 15.7 12 15.7 12 15.7C12 15.7 12.93 15.7 12.93 14.75C12.93 13.8 12.93 12.85 12.93 12.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11.5 10.5C11.5 10.5 11.5 8.5 12 8.5C12.5 8.5 12.5 8.5 13 9C13.5 9.5 14 9.5 14 9.5C14 9.5 14.5 9.5 14.5 9C14.5 8.5 14 8 13.5 7.5C13 7 12 7 12 7C12 7 11.5 7 11 7.5C10.5 8 10 8.5 10 9.5C10 10.5 10 10.5 10 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>FAQ</span>
          </Link>
          
          {!userEmail ? (
            <>
              <Link to="/login" className="nav-link">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Войти</span>
              </Link>
              
              <Link to="/register" className="nav-link">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 8V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 11H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Регистрация</span>
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="nav-link">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
                <rect x="3" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="15" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="13" y="3" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="13" y="12" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Личный кабинет</span>
            </Link>
          )}
          
          <div className="nav-phone">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
              <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
            </svg>
            <span>+375 29 897-52-19</span>
          </div>
        </div>
        
        {/* Кнопка мобильного меню */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={toggleMobileMenu} 
          aria-label="Меню"
          title="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
      </nav>
      
      {/* Оверлей мобильного меню */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={handleOverlayClick}
      ></div>
      
      {/* Мобильное меню */}
      <div 
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        ref={mobileMenuRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-menu-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15 8.5C15 8.5 13.5 9.5 12 9.5C10.5 9.5 9 8.5 9 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8.5 14C8.5 14 9.5 16 12 16C14.5 16 15.5 14 15.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-fit">Fit</span>
              <span className="logo-genius">Genius</span>
            </div>
          </Link>
        </div>
        
        <div className="mobile-menu-links">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Главная</span>
          </Link>
          
          <Link to="/prices" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
              <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
            </svg>
            <span>Цены и оплата</span>
          </Link>
          
          <Link to="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
              <path d="M12 15L13.57 11.57L17 10L13.57 8.43L12 5L10.43 8.43L7 10L10.43 11.57L12 15Z" fill="currentColor"/>
            </svg>
            <span>Отзывы</span>
          </Link>
          
          <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
              <path d="M11.07 12.85C11.07 12.85 11.07 13.8 11.07 14.75C11.07 15.7 12 15.7 12 15.7C12 15.7 12.93 15.7 12.93 14.75C12.93 13.8 12.93 12.85 12.93 12.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11.5 10.5C11.5 10.5 11.5 8.5 12 8.5C12.5 8.5 12.5 8.5 13 9C13.5 9.5 14 9.5 14 9.5C14 9.5 14.5 9.5 14.5 9C14.5 8.5 14 8 13.5 7.5C13 7 12 7 12 7C12 7 11.5 7 11 7.5C10.5 8 10 8.5 10 9.5C10 10.5 10 10.5 10 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>FAQ</span>
          </Link>
          
          {!userEmail ? (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Войти</span>
              </Link>
              
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 8V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 11H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Регистрация</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
                  <rect x="3" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="15" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="13" y="3" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="13" y="12" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Личный кабинет</span>
              </Link>
              
              <button onClick={handleLogout} className="mobile-menu-link mobile-menu-logout">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Выйти</span>
              </button>
              
              <div className="mobile-menu-info">
                <div className="mobile-menu-phone-display">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
                    <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
                  </svg>
                  <span>+375 29 897-52-19</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Убираем footer, так как телефон будет перемещен */}
      </div>
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
