import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      <header className="home-header">
        <h1>Персональная программа питания и тренировок для 100% результата</h1>
        <p className="home-subtitle">Ответьте на вопросы – получите идеальный рацион и план занятий под ваши цели</p>
        <div className="home-cta">
          <button onClick={() => navigate('/questionnaire?type=food')}>Создать программу питания</button>
          <button onClick={() => navigate('/questionnaire?type=workout')}>Создать программу тренировок</button>
          <button className="combo" onClick={() => navigate('/questionnaire?type=combo')}>Питание + Тренировки (комбо)</button>
        </div>
      </header>
      <section className="home-benefits">
        <h2>Почему выбирают нас?</h2>
        <div className="benefits-list">
          <div className="benefit">
            <span role="img" aria-label="user">👤</span>
            <p>Персонализация под ваши параметры</p>
          </div>
          <div className="benefit">
            <span role="img" aria-label="clock">⏱️</span>
            <p>Экономия времени на планирование</p>
          </div>
          <div className="benefit">
            <span role="img" aria-label="science">🔬</span>
            <p>Научный подход</p>
          </div>
        </div>
      </section>
      <section className="home-examples">
        <h2>Примеры программ</h2>
        <div className="examples-list">
          <div className="example">
            <div className="example-img food" />
            <div>
              <h3>Рацион для похудения</h3>
              <p>Сбалансированное меню на неделю, учитывающее ваши предпочтения и цели.</p>
            </div>
          </div>
          <div className="example">
            <div className="example-img workout" />
            <div>
              <h3>План тренировок для набора массы</h3>
              <p>Эффективные упражнения с учётом вашего уровня и доступного инвентаря.</p>
            </div>
          </div>
          <div className="example">
            <div className="example-img combo" />
            <div>
              <h3>Комплекс: питание + тренировки</h3>
              <p>Максимальный результат — синергия рациона и физической активности.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage; 