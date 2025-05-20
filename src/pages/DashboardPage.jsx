import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

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

function DashboardPage() {
  const [tab, setTab] = useState('food');
  const [note, setNote] = useState('');
  const [paidType, setPaidType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPaidType(localStorage.getItem('fitgenius_paid_type'));
  }, []);

  if (!paidType) {
    return (
      <div className="dash-bg">
        <div className="dash-center" style={{textAlign:'center',alignItems:'center',justifyContent:'center',minHeight:300}}>
          <h2>Личный кабинет</h2>
          <p style={{fontSize: '1.1rem', color: '#444', margin: '24px 0'}}>Вы ещё не приобрели ни одну услугу.<br/>Оформите заказ, чтобы получить индивидуальный план!</p>
          <button className="dash-btn dash-subscribe" onClick={()=>navigate('/payment')}>Перейти к оплате</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-bg">
      <div className="dash-center">
        <div className="dash-header">
          <h2>Добро пожаловать в личный кабинет!</h2>
          <div className="dash-actions">
            <button className="dash-btn">Экспорт в PDF</button>
            <button className="dash-btn">Настроить заново</button>
            <button className="dash-btn dash-subscribe">Подписка на обновления</button>
          </div>
        </div>
        <div className="dash-tabs">
          {(paidType === 'food' || paidType === 'combo') && (
            <button className={tab === 'food' ? 'active' : ''} onClick={() => setTab('food')}>Питание</button>
          )}
          {(paidType === 'workout' || paidType === 'combo') && (
            <button className={tab === 'workout' ? 'active' : ''} onClick={() => setTab('workout')}>Тренировки</button>
          )}
        </div>
        {tab === 'food' && (paidType === 'food' || paidType === 'combo') && (
          <div className="dash-food">
            <h3>Меню на неделю</h3>
            <div className="dash-food-plan">
              {foodPlan.map(day => (
                <div key={day.day} className="dash-food-day">
                  <div className="dash-food-dayname">{day.day}</div>
                  <ul>
                    {day.meals.map((m, i) => <li key={i}><b>{m.type}:</b> {m.text}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <h3>Список покупок</h3>
            <ul className="dash-shopping-list">
              {shoppingList.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}
        {tab === 'workout' && (paidType === 'workout' || paidType === 'combo') && (
          <div className="dash-workout">
            <h3>План тренировок на неделю</h3>
            <div className="dash-workout-plan">
              {workoutPlan.map(day => (
                <div key={day.day} className="dash-workout-day">
                  <div className="dash-workout-dayname">{day.day}</div>
                  <div>{day.workout}</div>
                </div>
              ))}
            </div>
            <h3>Заметки</h3>
            <textarea
              className="dash-note"
              placeholder="Добавьте свои заметки по тренировкам..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage; 