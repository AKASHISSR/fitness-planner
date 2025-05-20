import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const tariffs = [
  {
    type: 'food',
    title: 'Питание',
    price: 990,
    desc: 'Персональное меню на неделю, список покупок, рекомендации по питанию.',
  },
  {
    type: 'workout',
    title: 'Тренировки',
    price: 990,
    desc: 'План тренировок на неделю, упражнения, видео и советы.',
  },
  {
    type: 'combo',
    title: 'Комбо: питание + тренировки',
    price: 1490,
    oldPrice: 1980,
    desc: 'Всё включено: рацион и тренировки для максимального результата.',
    highlight: true,
  },
];

function PaymentPage() {
  const [selected, setSelected] = useState('combo');
  const navigate = useNavigate();

  const handlePay = () => {
    localStorage.setItem('fitgenius_paid_type', selected);
    setTimeout(() => navigate('/dashboard'), 800);
  };

  return (
    <div className="pay-bg">
      <div className="pay-center">
        <h2>Выберите тариф</h2>
        <div className="pay-tariffs">
          {tariffs.map(t => (
            <div
              key={t.type}
              className={`pay-tariff${selected === t.type ? ' selected' : ''}${t.highlight ? ' highlight' : ''}`}
              onClick={() => setSelected(t.type)}
            >
              <div className="pay-title">{t.title}</div>
              <div className="pay-desc">{t.desc}</div>
              <div className="pay-price">
                {t.oldPrice && <span className="old">{t.oldPrice} ₽</span>}
                <span>{t.price} ₽</span>
              </div>
              {t.highlight && <div className="pay-badge">Выгодно</div>}
            </div>
          ))}
        </div>
        <button className="pay-btn" onClick={handlePay}>Оплатить</button>
        <div className="pay-guarantee">
          <div>🔒 Безопасная оплата</div>
          <div>💸 Не подошло? Вернём деньги!</div>
          <div>🛠 Можно скорректировать параметры после оплаты</div>
          <div style={{marginTop:8, fontSize:14, color:'#888'}}>Поддержка: <a href="mailto:support@fitgenius.ru">support@fitgenius.ru</a></div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage; 