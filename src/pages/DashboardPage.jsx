import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, uploadUserAvatarToImgbb, getUserAvatar } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './DashboardPage.css';
import { ADMINS } from '../App';

const foodPlan = [
  { day: 'Понедельник', meals: [
    { type: 'Завтрак', text: 'Овсянка с ягодами и орехами' },
    { type: 'Обед', text: 'Куриная грудка, гречка, овощи' },
    { type: 'Ужин', text: 'Творог с фруктами' },
    { type: 'Перекус', text: 'Яблоко, миндаль' },
  ] },
  { day: 'Вторник', meals: [
    { type: 'Завтрак', text: 'Яичница, цельнозерновой хлеб' },
    { type: 'Обед', text: 'Рыба, картофель, салат' },
    { type: 'Ужин', text: 'Овощное рагу' },
    { type: 'Перекус', text: 'Греческий йогурт' },
  ] },
  // ... остальные дни ...
];

const shoppingList = [
  'Овсянка', 'Ягоды', 'Орехи', 'Куриная грудка', 'Гречка', 'Овощи',
  'Творог', 'Фрукты', 'Яблоко', 'Миндаль', 'Яйца', 'Хлеб', 'Рыба', 'Картофель', 'Салат', 'Йогурт'
];

const workoutPlan = [
  { day: 'Понедельник', workout: 'Силовая: приседания, отжимания, планка' },
  { day: 'Вторник', workout: 'Кардио: бег 30 мин, скакалка' },
  { day: 'Среда', workout: 'Отдых или йога' },
  { day: 'Четверг', workout: 'Силовая: выпады, подтягивания, пресс' },
  { day: 'Пятница', workout: 'Кардио: велотренажёр, прыжки' },
  { day: 'Суббота', workout: 'Функционалка: бурпи, выпрыгивания, планка' },
  { day: 'Воскресенье', workout: 'Отдых' },
];

function exportTextToPDF(text, filename = 'plan.pdf') {
  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<pre style="font-family:inherit;font-size:16px;white-space:pre-wrap;">' + text + '</pre>');
  win.document.close();
  win.print();
}

function DashboardPage() {
  const [tab, setTab] = useState('food');
  const [paidType, setPaidType] = useState(null);
  const [mealPlan, setMealPlan] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [user, setUser] = useState({ email: '', name: '' });
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState('');
  const [loadingName, setLoadingName] = useState(false);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setPaidType(localStorage.getItem('fitgenius_paid_type'));
    setMealPlan(localStorage.getItem('fitgenius_meal_plan') || '');
    setWorkoutPlan(localStorage.getItem('fitgenius_workout_plan') || '');
    const email = localStorage.getItem('fitgenius_user') || '';
    // Загружаем имя из Firestore, если есть email
    async function fetchName() {
      let name = localStorage.getItem('fitgenius_name') || 'Пользователь';
      if (email) {
        setLoadingName(true);
        try {
          const docRef = doc(db, 'users', email);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().name) {
            name = snap.data().name;
          }
        } catch {}
        setLoadingName(false);
      }
      setUser({ email, name });
      setNewName(name);
    }
    fetchName();
    // Загружаем историю активности
    async function fetchActivity() {
      if (!email) return;
      setLoadingActivity(true);
      try {
        const q = await import('firebase/firestore');
        const { collection, query, where, orderBy, getDocs } = q;
        const qAct = query(collection(db, 'user_activity'), where('email', '==', email), orderBy('timestamp', 'desc'));
        const snap = await getDocs(qAct);
        setActivity(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {}
      setLoadingActivity(false);
    }
    fetchActivity();
    // Загружаем аватар
    async function fetchAvatar() {
      if (!email) return;
      setLoadingAvatar(true);
      try {
        const url = await getUserAvatar(email);
        if (url) setAvatarUrl(url);
      } catch (e) {
        setAvatarError('Ошибка загрузки аватара');
      }
      setLoadingAvatar(false);
    }
    fetchAvatar();
  }, []);

  const handleNameSave = async () => {
    setLoadingName(true);
    localStorage.setItem('fitgenius_name', newName);
    setUser(u => ({ ...u, name: newName }));
    setEditName(false);
    // Сохраняем имя в Firestore
    if (user.email) {
      try {
        await setDoc(doc(db, 'users', user.email), { name: newName }, { merge: true });
      } catch {}
    }
    setLoadingName(false);
  };

  const isFoodPaid = paidType === 'food' || paidType === 'combo';
  const isWorkoutPaid = paidType === 'workout' || paidType === 'combo';
  const isAdmin = user.email && ADMINS.includes(user.email);

  const handleExport = () => {
    if (tab === 'food' && mealPlan) {
      exportTextToPDF(mealPlan, 'meal-plan.pdf');
    } else if (tab === 'workout' && workoutPlan) {
      exportTextToPDF(workoutPlan, 'workout-plan.pdf');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    console.log('Выбран файл:', file);
    console.log('Email пользователя:', user.email);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Можно загружать только изображения');
      console.error('Ошибка: выбран не image-файл');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Размер файла не должен превышать 2 МБ');
      console.error('Ошибка: файл больше 2 МБ');
      return;
    }
    setLoadingAvatar(true);
    setAvatarError('');
    try {
      const url = await uploadUserAvatarToImgbb(user.email, file);
      setAvatarUrl(url);
      console.log('Аватар успешно загружен. URL:', url);
    } catch (e) {
      setAvatarError('Ошибка загрузки файла');
      console.error('Ошибка загрузки аватара:', e);
    }
    setLoadingAvatar(false);
  };

  return (
    <div className="dash-bg">
      <div className="dash-center">
        {/* Блок профиля */}
        <div className="profile-block" style={{display:'flex',alignItems:'center',gap:24,marginBottom:32,flexWrap:'wrap'}}>
          <div className="profile-avatar" style={{width:88,height:88,borderRadius:'50%',overflow:'hidden',background:'#e6f7ea',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 12px #4fd16522',position:'relative'}}>
            {loadingAvatar ? (
              <span className="avatar-spinner" style={{fontSize:36,color:'#4fd165',animation:'spin 1s linear infinite'}}>⏳</span>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            ) : (
              <span style={{fontSize:48,color:'#4fd165'}}>👤</span>
            )}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {editName ? (
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{fontWeight:800,fontSize:'1.1rem',padding:'4px 8px',borderRadius:8,border:'1px solid #ccc'}}
                  maxLength={32}
                  disabled={loadingName}
                />
                <button onClick={handleNameSave} disabled={loadingName || !newName.trim()} style={{padding:'4px 10px',borderRadius:8,border:'none',background:'#4fd165',color:'#fff',fontWeight:700,cursor:'pointer'}}>Сохранить</button>
                <button onClick={()=>{setEditName(false);setNewName(user.name);}} disabled={loadingName} style={{padding:'4px 10px',borderRadius:8,border:'none',background:'#eee',color:'#333',fontWeight:700,cursor:'pointer'}}>Отмена</button>
                <button onClick={()=>{localStorage.removeItem('fitgenius_user');localStorage.removeItem('fitgenius_paid_type');window.location.href='/'}} style={{padding:'4px 14px',borderRadius:8,border:'none',background:'#4fd165',color:'#fff',fontWeight:700,cursor:'pointer',marginLeft:8}}>Выйти</button>
              </div>
            ) : (
              <div className="profile-block-name" style={{fontWeight:800,fontSize:'1.2rem',color:'#1a3a2b',display:'flex',alignItems:'center',gap:8}}>
                {user.name}
                <button onClick={()=>setEditName(true)} style={{background:'none',border:'none',color:'#4fd165',cursor:'pointer',fontSize:18}} title="Редактировать имя">✏️</button>
                {loadingName && <span style={{fontSize:14,color:'#888',marginLeft:8}}>Сохранение...</span>}
                <button onClick={()=>{localStorage.removeItem('fitgenius_user');localStorage.removeItem('fitgenius_paid_type');window.location.href='/'}} style={{padding:'4px 14px',borderRadius:8,border:'none',background:'#4fd165',color:'#fff',fontWeight:700,cursor:'pointer',marginLeft:8}}>Выйти</button>
              </div>
            )}
            <div className="profile-block-email" style={{color:'#444',fontSize:'1rem'}}>{user.email || '—'}</div>
            {/* Кнопка загрузки аватара */}
            <div style={{marginTop:8}}>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{display:'none'}}
                onChange={handleAvatarChange}
                disabled={loadingAvatar}
              />
              <button
                type="button"
                className="avatar-upload-btn"
                style={{
                  padding:'6px 18px',
                  borderRadius:8,
                  border:'1px solid #4fd165',
                  background:'#fff',
                  color:'#1a3a2b',
                  fontWeight:600,
                  fontSize:'1rem',
                  cursor: loadingAvatar ? 'not-allowed' : 'pointer',
                  opacity: loadingAvatar ? 0.6 : 1,
                  marginTop:0
                }}
                disabled={loadingAvatar}
                onClick={() => document.getElementById('avatar-upload').click()}
              >
                {loadingAvatar ? 'Загрузка...' : 'Загрузить аватар'}
              </button>
            </div>
            {avatarError && <div style={{color:'red',fontSize:13,marginTop:4}}>{avatarError}</div>}
          </div>
        </div>
        {/* --- конец блока профиля --- */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          marginBottom: 24,
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}>
          <button
            className={`dash-btn${tab === 'food' ? ' dash-subscribe' : ''}`}
            onClick={() => setTab('food')}
            style={{ flex: '1 1 auto', minWidth: '120px' }}
          >
            Программа питания
          </button>
          <button
            className={`dash-btn${tab === 'workout' ? ' dash-subscribe' : ''}`}
            onClick={() => setTab('workout')}
            style={{ flex: '1 1 auto', minWidth: '120px' }}
          >
            Программа тренировок
          </button>
          <button
            className={`dash-btn${tab === 'activity' ? ' dash-subscribe' : ''}`}
            onClick={() => setTab('activity')}
            style={{ flex: '1 1 auto', minWidth: '120px' }}
          >
            История активности
          </button>
          <button
            className="dash-btn"
            onClick={handleExport}
            disabled={tab === 'food' ? !mealPlan : !workoutPlan}
            style={{ flex: '1 1 auto', minWidth: '120px' }}
          >
            Экспорт в PDF
          </button>
        </div>

        {/* Кнопка 'Админ' только для админов */}
        {isAdmin && (
          <button className="dash-btn" style={{marginBottom:16,background:'#4fd165',color:'#fff',fontWeight:700}} onClick={()=>navigate('/admin')}>
            Админ-панель
          </button>
        )}

        {tab === 'food' && (
          isFoodPaid ? (
            mealPlan
              ? <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{mealPlan}</pre>
              : <div>Ваша программа питания скоро появится!</div>
          ) : (
            <div>
              <b>Не оплачено.</b> Пройдите опрос и приобретите программу!
            </div>
          )
        )}

        {tab === 'workout' && (
          isWorkoutPaid ? (
            workoutPlan
              ? <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{workoutPlan}</pre>
              : <div>Ваша программа тренировок скоро появится!</div>
          ) : (
            <div>
              <b>Не оплачено.</b> Пройдите опрос и приобретите программу!
            </div>
          )
        )}

        {tab === 'activity' && (
          <div style={{marginTop:8}}>
            <h3 style={{marginBottom:12}}>История активности</h3>
            {loadingActivity ? (
              <div>Загрузка...</div>
            ) : activity.length === 0 ? (
              <div>Нет данных об активности.</div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: '100%',
                overflowX: 'hidden'
              }}>
                {activity.map(ev => (
                  <div key={ev.id} style={{
                    background: '#f7f8fa',
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: '0 2px 8px #0001',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 8
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        whiteSpace: 'nowrap'
                      }}>
                        {ev.timestamp ? new Date(ev.timestamp.seconds*1000).toLocaleString() : ''}
                      </div>
                      <div style={{
                        background: '#e6f7ea',
                        color: '#1a3a2b',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}>
                        {ev.type || '-'}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      color: '#333',
                      wordBreak: 'break-word'
                    }}>
                      {ev.desc || '-'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage; 