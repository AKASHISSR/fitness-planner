import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './LoginRegister.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-center">
        <h2 style={{textAlign:'center',marginBottom:24}}>Регистрация</h2>
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="login-input" />
          <input type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} required className="login-input" />
          {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Регистрация...' : 'Зарегистрироваться'}</button>
        </form>
        <div style={{marginTop:18,textAlign:'center',fontSize:15}}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 