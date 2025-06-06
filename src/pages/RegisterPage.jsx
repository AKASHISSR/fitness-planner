import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, logUserActivity } from '../firebase';
import './AuthPages.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Проверка силы пароля
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    // Проверка силы пароля
    if (passwordStrength < 2) {
      setError('Пароль слишком слабый. Используйте не менее 8 символов, включая заглавные буквы, цифры или специальные символы.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Сохраняем email для автозаполнения при входе
      localStorage.setItem('fitgenius_last_email', email);
      
      // Логируем активность
      await logUserActivity({ 
        email: user.email, 
        type: 'Регистрация', 
        desc: 'Пользователь зарегистрировался через email' 
      });
      
      // Перенаправляем на страницу входа с сообщением об успешной регистрации
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Этот email уже используется. Попробуйте войти или восстановить пароль.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Неверный формат email.');
      } else if (err.code === 'auth/weak-password') {
        setError('Пароль слишком слабый. Используйте не менее 6 символов.');
      } else {
        setError('Ошибка при регистрации: ' + err.message);
      }
    }
    setLoading(false);
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
        
        <h2 className="auth-title">Создание аккаунта</h2>
        
        <form onSubmit={handleRegister} className="auth-form">
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
              onChange={handlePasswordChange} 
              required 
              className="auth-input" 
              autoComplete="new-password"
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
          
          {/* Индикатор силы пароля */}
          <div style={{ marginTop: '-10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    height: '4px', 
                    flex: 1, 
                    background: i < passwordStrength ? 
                      passwordStrength === 1 ? '#f39c12' : 
                      passwordStrength === 2 ? '#2ecc71' : 
                      passwordStrength === 3 ? '#27ae60' : 
                      passwordStrength === 4 ? '#27ae60' : '#e0e0e0' 
                      : '#e0e0e0',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#777', textAlign: 'right' }}>
              {passwordStrength === 0 && password.length > 0 && 'Очень слабый'}
              {passwordStrength === 1 && 'Слабый'}
              {passwordStrength === 2 && 'Средний'}
              {passwordStrength === 3 && 'Хороший'}
              {passwordStrength === 4 && 'Отличный'}
            </div>
          </div>
          
          <div className="auth-input-group">
            <div className="auth-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="currentColor"/>
              </svg>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Подтвердите пароль" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              className="auth-input" 
              autoComplete="new-password"
            />
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        

        
        <div className="auth-link-container">
          Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 