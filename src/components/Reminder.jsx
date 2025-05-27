import React, { useState } from 'react';
import './Reminder.css';

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u0434u043bu044f u043eu0442u043eu0431u0440u0430u0436u0435u043du0438u044f u043du0430u043fu043eu043cu0438u043du0430u043du0438u0439 u043e u0442u0440u0435u043du0438u0440u043eu0432u043au0430u0445 u0438 u043fu0438u0442u0430u043du0438u0438
 * @param {Object} props
 * @param {string} props.title - u0417u0430u0433u043eu043bu043eu0432u043eu043a u043du0430u043fu043eu043cu0438u043du0430u043du0438u044f
 * @param {string} props.message - u0422u0435u043au0441u0442 u043du0430u043fu043eu043cu0438u043du0430u043du0438u044f
 * @param {string} props.time - u0412u0440u0435u043cu044f u043du0430u043fu043eu043cu0438u043du0430u043du0438u044f
 * @param {string} props.type - u0422u0438u043f u043du0430u043fu043eu043cu0438u043du0430u043du0438u044f (workout, food, water, general)
 * @param {Function} props.onDismiss - u0424u0443u043du043au0446u0438u044f u043fu0440u0438 u0437u0430u043au0440u044bu0442u0438u0438 u043du0430u043fu043eu043cu0438u043du0430u043du0438u044f
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
function Reminder({ 
  title, 
  message, 
  time, 
  type = 'general', 
  onDismiss, 
  className = ''
}) {
  const [dismissed, setDismissed] = useState(false);
  
  // Иконки для разных типов напоминаний
  const icons = {
    workout: '🏋️',
    food: '🍴',
    water: '💧',
    general: '🔔'
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300); // u0417u0430u0434u0435u0440u0436u043au0430 u043fu043eu0441u043bu0435 u0430u043du0438u043cu0430u0446u0438u0438 u0438u0441u0447u0435u0437u043du043eu0432u0435u043du0438u044f
  };
  
  return (
    <div className={`reminder ${type} ${dismissed ? 'dismissed' : ''} ${className}`}>
      <div className="reminder-icon">{icons[type]}</div>
      <div className="reminder-content">
        <div className="reminder-header">
          <div className="reminder-title">{title}</div>
          <div className="reminder-time">{time}</div>
        </div>
        <div className="reminder-message">{message}</div>
      </div>
      <button className="reminder-dismiss" onClick={handleDismiss} aria-label="Закрыть напоминание">✕</button>
    </div>
  );
}

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u0434u043bu044f u0433u0440u0443u043fu043fu044b u043du0430u043fu043eu043cu0438u043du0430u043du0438u0439
 * @param {Object} props
 * @param {React.ReactNode} props.children - u0421u043eu0434u0435u0440u0436u0438u043cu043eu0435 (u043du0430u043fu043eu043cu0438u043du0430u043du0438u044f)
 * @param {string} props.title - u0417u0430u0433u043eu043bu043eu0432u043eu043a u0433u0440u0443u043fu043fu044b u043du0430u043fu043eu043cu0438u043du0430u043du0438u0439
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
export function ReminderGroup({ children, title, className = '' }) {
  return (
    <div className={`reminder-group ${className}`}>
      {title && <h3 className="reminder-group-title">{title}</h3>}
      <div className="reminder-group-content">
        {children}
      </div>
    </div>
  );
}

export default Reminder;
