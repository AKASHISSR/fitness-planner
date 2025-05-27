import React from 'react';
import './Schedule.css';

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u0434u043bu044f u043eu0442u043eu0431u0440u0430u0436u0435u043du0438u044f u0440u0430u0441u043fu0438u0441u0430u043du0438u044f u0442u0440u0435u043du0438u0440u043eu0432u043eu043a u0438u043bu0438 u043fu0438u0442u0430u043du0438u044f
 * @param {Object} props
 * @param {Array} props.items - u042du043bu0435u043cu0435u043du0442u044b u0440u0430u0441u043fu0438u0441u0430u043du0438u044f
 * @param {string} props.type - u0422u0438u043f u0440u0430u0441u043fu0438u0441u0430u043du0438u044f (workout, food)
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
function Schedule({ items = [], type = 'workout', className = '' }) {
  // u0418u043au043eu043du043au0438 u0434u043bu044f u0440u0430u0437u043du044bu0445 u0442u0438u043fu043eu0432 u0440u0430u0441u043fu0438u0441u0430u043du0438u044f  // Иконки для разных типов расписания
  const icons = {
    workout: '🏋️',
    food: '🍴'
  };
  
  return (
    <div className={`schedule ${type} ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="schedule-item">
          <div className="schedule-item-header">
            <div className="schedule-item-day">{item.day}</div>
            <div className="schedule-item-icon">{icons[type]}</div>
          </div>
          <div className="schedule-item-content">
            {type === 'workout' && (
              <div className="schedule-workout">{item.workout}</div>
            )}
            {type === 'food' && item.meals && (
              <div className="schedule-meals">
                {item.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="schedule-meal">
                    <div className="schedule-meal-type">{meal.type}</div>
                    <div className="schedule-meal-text">{meal.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u0434u043bu044f u043eu0442u043eu0431u0440u0430u0436u0435u043du0438u044f u0441u043fu0438u0441u043au0430 u043fu0440u043eu0434u0443u043au0442u043eu0432
 * @param {Object} props
 * @param {Array} props.items - u0421u043fu0438u0441u043eu043a u043fu0440u043eu0434u0443u043au0442u043eu0432
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
export function ShoppingList({ items = [], className = '' }) {
  return (
    <div className={`shopping-list ${className}`}>
      <div className="shopping-list-header">
        <div className="shopping-list-title">Список продуктов</div>
        <div className="shopping-list-icon">🛒</div>
      </div>
      <div className="shopping-list-items">
        {items.map((item, index) => (
          <div key={index} className="shopping-list-item">
            <input type="checkbox" id={`item-${index}`} className="shopping-list-checkbox" />
            <label htmlFor={`item-${index}`} className="shopping-list-label">{item}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;
