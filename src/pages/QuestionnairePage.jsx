import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuestionnairePage.css';
import { logUserActivity } from '../firebase';

const COMMON_QUESTIONS = [
  { name: 'gender', label: 'Пол', type: 'select', options: ['Мужской', 'Женский'] },
  { name: 'age', label: 'Возраст', type: 'number', min: 10, max: 100 },
  { name: 'weight', label: 'Вес (кг)', type: 'number', min: 30, max: 250 },
  { name: 'height', label: 'Рост (см)', type: 'number', min: 120, max: 230 },
  { name: 'activity', label: 'Уровень активности', type: 'select', options: ['Сидячий', 'Умеренный', 'Высокий'] },
  { name: 'goal', label: 'Цель', type: 'select', options: ['Похудение', 'Поддержание веса', 'Набор массы', 'Тонус', 'Выносливость'] },
];

const FOOD_QUESTIONS = [
  { name: 'diet', label: 'Тип диеты', type: 'select', options: ['Обычная', 'Веган', 'Кето', 'Палео', 'Другое'] },
  { name: 'allergies', label: 'Аллергии/непереносимости', type: 'text' },
  { name: 'dislikes', label: 'Нелюбимые продукты', type: 'text' },
  { name: 'budget', label: 'Бюджет на еду', type: 'select', options: ['Эконом', 'Стандарт', 'Премиум'] },
  { name: 'cooktime', label: 'Время на готовку (минут в день)', type: 'number', min: 10, max: 180 },
];

const WORKOUT_QUESTIONS = [
  { name: 'experience', label: 'Опыт тренировок', type: 'select', options: ['Новичок', 'Средний', 'Продвинутый'] },
  { name: 'equipment', label: 'Доступный инвентарь', type: 'select', options: ['Только тело', 'Гантели', 'Тренажёры'] },
  { name: 'preference', label: 'Предпочтения', type: 'select', options: ['Силовые', 'Кардио', 'Йога', 'Функционалка'] },
  { name: 'days', label: 'Тренировок в неделю', type: 'number', min: 1, max: 7 },
  { name: 'injuries', label: 'Травмы/ограничения', type: 'text' },
];

function getQuestions(type) {
  if (type === 'food') return [...COMMON_QUESTIONS, ...FOOD_QUESTIONS];
  if (type === 'workout') return [...COMMON_QUESTIONS, ...WORKOUT_QUESTIONS];
  return [...COMMON_QUESTIONS, ...FOOD_QUESTIONS, ...WORKOUT_QUESTIONS];
}

function QuestionnairePage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const type = new URLSearchParams(search).get('type') || 'combo';
  const questions = useMemo(() => getQuestions(type), [type]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[step];
  const isLast = step === questions.length - 1;

  const handleChange = (e) => {
    setAnswers({ ...answers, [current.name]: e.target.value });
  };

  const handleNext = () => {
    if (!answers[current.name] && current.type !== 'text') return;
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('fitgenius_selected_type', type);
    localStorage.setItem('fitgenius_questionnaire_answers', JSON.stringify(answers));
    // Логируем прохождение опроса
    const email = localStorage.getItem('fitgenius_user') || '';
    await logUserActivity({ email, type: 'Опрос', desc: `Пройден опрос: ${type}` });
    navigate('/pay');
  };

  return (
    <div className="questionnaire-bg">
      <div className="questionnaire-center">
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Анкета: {type === 'food' ? 'Питание' : type === 'workout' ? 'Тренировки' : 'Комбо'}</h2>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <progress value={step + 1} max={questions.length} style={{ width: '80%' }} />
          <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>Шаг {step + 1} из {questions.length}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>{current.label}</label>
            {current.type === 'select' && (
              <select value={answers[current.name] || ''} onChange={handleChange} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 18 }}>
                <option value="" disabled>Выберите...</option>
                {current.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {current.type === 'number' && (
              <input type="number" min={current.min} max={current.max} value={answers[current.name] || ''} onChange={handleChange} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 18 }} />
            )}
            {current.type === 'text' && (
              <input type="text" value={answers[current.name] || ''} onChange={handleChange} placeholder="Введите..." style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 18 }} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={handlePrev} disabled={step === 0} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#eee', color: '#333', fontWeight: 500, fontSize: 16, cursor: step === 0 ? 'not-allowed' : 'pointer' }}>Назад</button>
            {!isLast && (
              <button type="button" onClick={handleNext} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#4fd165', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Далее</button>
            )}
            {isLast && (
              <button type="submit" style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#1a3a2b', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Сгенерировать программу</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionnairePage; 