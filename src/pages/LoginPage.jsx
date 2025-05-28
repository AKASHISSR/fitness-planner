import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, logUserActivity } from '../firebase';
import './AuthPages.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // Проверяем, есть ли сохраненный email
  useEffect(() => {
    const savedEmail = localStorage.getItem('fitgenius_last_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('fitgenius_user', email);
      localStorage.setItem('fitgenius_last_email', email);
      setError('');
      await logUserActivity({ email, type: 'Вход', desc: 'Пользователь вошёл в аккаунт' });
      navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка входа:', err.message);
      if (err.code === 'auth/invalid-credential') {
        setError('Неверный email или пароль');
      } else if (err.code === 'auth/user-not-found') {
        setError('Пользователь с таким email не найден');
      } else if (err.code === 'auth/wrong-password') {
        setError('Неверный пароль');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Слишком много попыток входа. Попробуйте позже');
      } else {
        setError('Ошибка входа: ' + err.message);
      }
    }
    setLoading(false);
  };
  
  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('fitgenius_user', user.email);
      localStorage.setItem('fitgenius_last_email', user.email);
      await logUserActivity({ email: user.email, type: 'Вход через Google', desc: 'Пользователь вошёл через Google' });
      navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка входа через Google:', err);
      setError('Ошибка входа через Google');
    }
    setSocialLoading(false);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" stroke="white" strokeWidth="1.5"/>
              <path d="M15 8.5C15 8.5 13.5 9.5 12 9.5C10.5 9.5 9 8.5 9 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8.5 14C8.5 14 9.5 16 12 16C14.5 16 15.5 14 15.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8.5 12H15.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="auth-logo-text">
            <span className="logo-fit">Fit</span>
            <span className="logo-genius">Genius</span>
          </div>
        </div>
        
        <h2 className="auth-title">Вход в аккаунт</h2>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-group">
            <div className="auth-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
              </svg>
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="auth-input" 
              autoComplete="email"
            />
          </div>
          
          <div className="auth-input-group">
            <div className="auth-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="currentColor"/>
              </svg>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Пароль" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="auth-input" 
              autoComplete="current-password"
            />
            <div 
              className="auth-input-icon" 
              style={{ left: 'auto', right: '15px', cursor: 'pointer' }}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6ZM12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7Z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C20.23 12.72 19.4 13.77 18.41 14.62L19.82 16.03C21.21 14.8 22.31 13.26 23 11.5C21.27 7.11 17 4 12 4C10.73 4 9.51 4.2 8.36 4.57L10.01 6.22C10.66 6.09 11.32 6 12 6ZM10.93 7.14L13 9.21C13.57 9.46 14.03 9.92 14.28 10.49L16.35 12.56C16.43 12.22 16.5 11.86 16.5 11.5C16.5 9.02 14.48 7 12 7C11.64 7 11.28 7.07 10.93 7.14ZM2.01 3.87L4.69 6.55C3.06 7.83 1.77 9.53 1 11.5C2.73 15.89 7 19 12 19C13.52 19 14.98 18.71 16.32 18.18L19.74 21.6L21.15 20.19L3.42 2.45L2.01 3.87ZM9.51 11.37L12.12 13.98C12.08 13.99 12.04 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 11.45 9.51 11.42 9.51 11.37ZM6.11 7.97L7.86 9.72C7.63 10.27 7.5 10.87 7.5 11.5C7.5 13.98 9.52 16 12 16C12.63 16 13.23 15.87 13.77 15.64L14.75 16.62C13.87 16.86 12.95 17 12 17C8.21 17 4.83 14.87 3.18 11.5C3.88 10.07 4.9 8.89 6.11 7.97Z" fill="currentColor"/>
                </svg>
              )}
            </div>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>или</span>
        </div>
        
        <div className="social-auth-buttons">
          <button 
            className="social-auth-button" 
            onClick={handleGoogleLogin} 
            disabled={socialLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Войти через Google
          </button>
        </div>
        
        <div className="auth-link-container">
          Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 