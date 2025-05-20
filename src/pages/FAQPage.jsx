import './FAQPage.css';
import { useState } from 'react';

function FAQPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Введите корректный email');
      return;
    }
    setError('');
    const feedback = JSON.parse(localStorage.getItem('fitgenius_feedback') || '[]');
    feedback.push({ ...form, date: new Date().toLocaleString() });
    localStorage.setItem('fitgenius_feedback', JSON.stringify(feedback));
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="faq-article">
      <h1>FAQ: Почему FitGenius — это ваш лучший помощник в питании и тренировках?</h1>
      <h2>Что такое FitGenius?</h2>
      <p>
        <b>FitGenius</b> — это онлайн-сервис, который за считанные минуты подберёт для вас индивидуальную программу питания и тренировок, полностью под ваши цели, параметры и образ жизни.
      </p>
      <h2>В чём польза сайта?</h2>
      <ul>
        <li><b>Экономия времени:</b> не нужно часами искать диеты и тренировки — всё подбирается автоматически.</li>
        <li><b>Персонализация:</b> учитываются ваши цели, предпочтения, аллергии, бюджет, опыт и даже доступный инвентарь.</li>
        <li><b>Научный подход:</b> алгоритмы основаны на современных принципах нутрициологии и спортивной физиологии.</li>
        <li><b>Гибкость:</b> можно скорректировать программу после получения, попробовать разные варианты.</li>
        <li><b>Всё в одном месте:</b> меню, список покупок, тренировки, заметки, экспорт в PDF, подписка на обновления.</li>
      </ul>
      <h2>Для кого этот сервис?</h2>
      <ul>
        <li>Для тех, кто хочет похудеть, набрать массу или просто быть в тонусе.</li>
        <li>Для занятых людей, которым важно быстро получать готовые решения.</li>
        <li>Для новичков и опытных — вопросы и планы адаптируются под ваш уровень.</li>
        <li>Для всех, кто ценит здоровье и хочет получать результат с удовольствием!</li>
      </ul>
      <h2>Как это работает?</h2>
      <ol>
        <li>Вы отвечаете на короткий опрос.</li>
        <li>Выбираете нужную услугу (питание, тренировки или комбо).</li>
        <li>Оплачиваете — и сразу получаете доступ к личному кабинету с индивидуальным планом.</li>
        <li>Пользуетесь, корректируете, экспортируете, делитесь с друзьями!</li>
      </ol>
      <h2>Почему стоит доверять FitGenius?</h2>
      <ul>
        <li>Гарантия возврата денег, если программа не подойдёт.</li>
        <li>Возможность бесплатной корректировки параметров.</li>
        <li>Постоянная поддержка и обновления.</li>
        <li>Партнёрские скидки и бонусы для постоянных клиентов.</li>
      </ul>
      <h2>Остались вопросы?</h2>
      <p>Пишите нам на <a href="mailto:support@fitgenius.ru">support@fitgenius.ru</a> или через форму обратной связи:</p>
      <form className="faq-feedback-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
          value={form.name}
          onChange={handleChange}
          className="faq-feedback-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email для ответа"
          value={form.email}
          onChange={handleChange}
          className="faq-feedback-input"
          required
        />
        <textarea
          name="message"
          placeholder="Ваш вопрос или сообщение..."
          value={form.message}
          onChange={handleChange}
          className="faq-feedback-textarea"
          required
        />
        {error && <div className="faq-feedback-error">{error}</div>}
        {sent && <div className="faq-feedback-success">Спасибо! Ваше сообщение отправлено.</div>}
        <button type="submit" className="faq-feedback-btn">Отправить</button>
      </form>
    </div>
  );
}

export default FAQPage; 