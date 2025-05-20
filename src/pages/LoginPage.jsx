import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginRegister.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('fitgenius_users') || '{}');
    if (!users[email] || users[email].password !== password) {
      setError('Неверный email или пароль');
      return;
    }
    localStorage.setItem('fitgenius_user', email);
    setError('');
    navigate('/dashboard');
  };

  return (
    <div className="login-bg">
      <div className="login-center">
        <h2 style={{textAlign:'center',marginBottom:24}}>Вход</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="login-input" />
          <input type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} required className="login-input" />
          {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
          <button type="submit" className="login-btn">Войти</button>
        </form>
        <div style={{marginTop:18,textAlign:'center',fontSize:15}}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 