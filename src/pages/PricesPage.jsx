import './PricesPage.css';

function PricesPage() {
  return (
    <div className="prices-bg">
      <div className="prices-center">
        <h1 className="prices-title">Цены и оплата</h1>
        <p className="prices-period">Все цены указаны за 1 неделю пользования программой</p>
        <div className="prices-tariffs">
          <div className="prices-tariff">
            <div className="prices-tariff-title">Программа питания</div>
            <div className="prices-tariff-price">20 руб.</div>
          </div>
          <div className="prices-tariff">
            <div className="prices-tariff-title">Программа тренировок</div>
            <div className="prices-tariff-price">30 руб.</div>
          </div>
          <div className="prices-tariff highlight">
            <div className="prices-tariff-title">Комбо: питание + тренировки</div>
            <div className="prices-tariff-price">40 руб.</div>
          </div>
        </div>
        <div className="prices-howto">
          <h2>Как оплатить?</h2>
          <ul>
            <li>Выберите нужную программу и заполните анкету</li>
            <li>После заполнения анкеты вы перейдёте на страницу оплаты</li>
            <li>Оплатить можно картой любого банка, через ЕРИП, Apple Pay, Google Pay</li>
            <li>После оплаты программа будет доступна в личном кабинете</li>
          </ul>
        </div>
        <div className="prices-note">
          Все платежи защищены и проходят через сертифицированные платёжные системы.<br/>
          Если возникнут вопросы — пишите на <a href="mailto:support@fitgenius.ru">support@fitgenius.ru</a>
        </div>
      </div>
    </div>
  );
}

export default PricesPage; 