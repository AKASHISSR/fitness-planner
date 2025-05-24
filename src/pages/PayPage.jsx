import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logUserActivity } from '../firebase';

const TARIFFS = {
  food: { name: 'Питание', price: 990 },
  workout: { name: 'Тренировки', price: 990 },
  combo: { name: 'Комбо: питание + тренировки', price: 1490 },
};

function PayPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('food');
  const [tariff, setTariff] = useState(TARIFFS.food);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('fitgenius_selected_type') || 'food';
    setType(t);
    setTariff(TARIFFS[t] || TARIFFS.food);
  }, []);

  const handlePay = async () => {
    setLoading(true);
    // Здесь должна быть интеграция с оплатой (заглушка)
    setTimeout(async () => {
      localStorage.setItem('fitgenius_paid_type', type);
      // Логируем покупку
      const email = localStorage.getItem('fitgenius_user') || '';
      await logUserActivity({ email, type: 'Покупка', desc: `Оплачен тариф: ${tariff.name}` });
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="pay-center">
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Оплата</h2>
        <div style={{ fontSize: 20, marginBottom: 16, textAlign: 'center' }}>
          <b>Тариф:</b> {tariff.name}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>
          Сумма к оплате: {tariff.price} ₽
        </div>
        <button
          onClick={handlePay}
          disabled={loading}
          style={{ width: '100%', padding: '16px 0', borderRadius: 10, border: 'none', background: '#4fd165', color: '#fff', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}
        >
          {loading ? 'Оплата...' : 'Оплатить'}
        </button>
      </div>
    </div>
  );
}

export default PayPage; 