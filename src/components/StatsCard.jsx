import React from 'react';
import Card from './Card';
import './StatsCard.css';

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u0434u043bu044f u043eu0442u043eu0431u0440u0430u0436u0435u043du0438u044f u0441u0442u0430u0442u0438u0441u0442u0438u043au0438 u0441 u043fu043eu0434u0434u0435u0440u0436u043au043eu0439 u0442u0435u043cu043du043eu0439/u0441u0432u0435u0442u043bu043eu0439 u0442u0435u043cu044b
 * @param {Object} props
 * @param {string} props.title - u0417u0430u0433u043eu043bu043eu0432u043eu043a u043au0430u0440u0442u043eu0447u043au0438
 * @param {string} props.value - u0417u043du0430u0447u0435u043du0438u0435 u0441u0442u0430u0442u0438u0441u0442u0438u043au0438
 * @param {string} props.unit - u0415u0434u0438u043du0438u0446u0430 u0438u0437u043cu0435u0440u0435u043du0438u044f (u043eu043fu0446u0438u043eu043du0430u043bu044cu043du043e)
 * @param {string} props.icon - u0418u043au043eu043du043au0430 (u044du043cu043eu0434u0436u0438 u0438u043bu0438 u0441u0438u043cu0432u043eu043b)
 * @param {string} props.color - u0426u0432u0435u0442 u043au0430u0440u0442u043eu0447u043au0438 (primary, success, warning, danger, info)
 * @param {number} props.change - u0418u0437u043cu0435u043du0435u043du0438u0435 u0437u043du0430u0447u0435u043du0438u044f u0432 u043fu0440u043eu0446u0435u043du0442u0430u0445 (u043eu043fu0446u0438u043eu043du0430u043bu044cu043du043e)
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
function StatsCard({ 
  title, 
  value, 
  unit = '', 
  icon, 
  color = 'primary', 
  change, 
  className = '',
  ...props 
}) {
  // u041eu043fu0440u0435u0434u0435u043bu044fu0435u043c u043du0430u043fu0440u0430u0432u043bu0435u043du0438u0435 u0438u0437u043cu0435u043du0435u043du0438u044f (u0440u043eu0441u0442 u0438u043bu0438 u043fu0430u0434u0435u043du0438u0435)
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  return (
    <Card 
      className={`stats-card ${color} ${className}`}
      {...props}
    >
      <div className="stats-header">
        <div className="stats-title">{title}</div>
        {icon && <div className="stats-icon">{icon}</div>}
      </div>
      <div className="stats-value">
        {value}
        {unit && <span className="stats-unit">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className={`stats-change ${isPositive ? 'positive' : isNegative ? 'negative' : ''}`}>
          {isPositive && '↑'}
          {isNegative && '↓'}
          {Math.abs(change)}%
        </div>
      )}
    </Card>
  );
}

/**
 * u0413u0440u0443u043fu043fu0430 u043au0430u0440u0442u043eu0447u0435u043a u0441u0442u0430u0442u0438u0441u0442u0438u043au0438
 * @param {Object} props
 * @param {React.ReactNode} props.children - u0421u043eu0434u0435u0440u0436u0438u043cu043eu0435 (u043au0430u0440u0442u043eu0447u043au0438 u0441u0442u0430u0442u0438u0441u0442u0438u043au0438)
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
export function StatsCardGroup({ children, className = '' }) {
  return (
    <div className={`stats-card-group ${className}`}>
      {children}
    </div>
  );
}

export default StatsCard;
