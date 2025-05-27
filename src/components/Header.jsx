import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ADMINS } from '../App';
import ThemeToggle from './ThemeToggle';

function Header() {
  const user = localStorage.getItem('fitgenius_user');
  const navigate = useNavigate();
  const isAdmin = user && ADMINS.includes(user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);

  // Принудительно закрываем меню при загрузке страницы
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Обработчик прокрутки для эффекта прозрачности шапки
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие мобильного меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрываем меню при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Функция переключения мобильного меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Блокируем прокрутку страницы при открытом меню
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`} ref={headerRef}>
      <nav>
        <div className="main-header-left">
          <ThemeToggle />
          <Link to="/" className="main-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M21 12H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-fit">Fit</span>
              <span className="logo-genius">Genius</span>
            </div>
          </Link>
        </div>
        
        <div className="main-header-right">
          {/* Десктопные ссылки - видны только на больших экранах */}
          <div className="header-nav-links">
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/prices" className="nav-link">Цены и оплата</Link>
            <Link to="/reviews" className="nav-link">Отзывы</Link>
            <Link to="/faq" className="nav-link">FAQ</Link>
            
            {!user ? (
              <>
                <Link to="/login" className="nav-link">Войти</Link>
                <Link to="/register" className="nav-link main-admin-btn">Регистрация</Link>
              </>
            ) : (
              <Link to="/dashboard" className="nav-link main-admin-btn">
                Личный кабинет
              </Link>
            )}
          </div>
          
          {/* Кнопка бургера - видна только на мобильных */}
          <button 
            className={`burger-button ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Меню"
            title="Меню"
          >
            <div className="burger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>
      
      {/* Мобильное меню - абсолютно позиционированное */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
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
        
        {!user ? (
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
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
              <rect x="3" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="15" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="13" y="3" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="13" y="12" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Личный кабинет</span>
          </Link>
        )}
        
        <div className="mobile-phone">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-menu-icon">
            <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
          </svg>
          <span>+375 29 897-52-19</span>
        </div>
      </div>
      
      {/* Оверлей для закрытия меню */}
      {isMobileMenuOpen && <div className="menu-overlay" onClick={toggleMobileMenu}></div>}
    </header>
  );
}

export default Header;
