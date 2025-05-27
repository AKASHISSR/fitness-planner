import React from 'react';
import './Card.css';

/**
 * u0410u0434u0430u043fu0442u0438u0432u043du044bu0439 u043au043eu043cu043fu043eu043du0435u043du0442 u043au0430u0440u0442u043eu0447u043au0438 u0441 u043fu043eu0434u0434u0435u0440u0436u043au043eu0439 u0442u0435u043cu043du043eu0439/u0441u0432u0435u0442u043bu043eu0439 u0442u0435u043cu044b
 * @param {Object} props
 * @param {React.ReactNode} props.children - u0421u043eu0434u0435u0440u0436u0438u043cu043eu0435 u043au0430u0440u0442u043eu0447u043au0438
 * @param {string} props.title - u0417u0430u0433u043eu043bu043eu0432u043eu043a u043au0430u0440u0442u043eu0447u043au0438 (u043eu043fu0446u0438u043eu043du0430u043bu044cu043du043e)
 * @param {string} props.subtitle - u041fu043eu0434u0437u0430u0433u043eu043bu043eu0432u043eu043a u043au0430u0440u0442u043eu0447u043au0438 (u043eu043fu0446u0438u043eu043du0430u043bu044cu043du043e)
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @param {string} props.variant - u0412u0430u0440u0438u0430u043du0442 u043au0430u0440u0442u043eu0447u043au0438 (default, primary, success, warning, danger, info)
 * @param {boolean} props.elevated - u0414u043eu0431u0430u0432u043bu044fu0435u0442 u044du0444u0444u0435u043au0442 u043fu043eu0434u043du044fu0442u0438u044f u043au0430u0440u0442u043eu0447u043au0438 u043fu0440u0438 u043du0430u0432u0435u0434u0435u043du0438u0438
 * @param {Object} props.style - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 inline u0441u0442u0438u043bu0438
 * @returns {React.ReactElement}
 */
function Card({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  variant = 'default', 
  elevated = false, 
  style = {},
  ...props 
}) {
  return (
    <div 
      className={`adaptive-card ${variant} ${elevated ? 'elevated' : ''} ${className}`}
      style={style}
      {...props}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u0434u043bu044f u0433u0440u0443u043fu043fu044b u043au0430u0440u0442u043eu0447u0435u043a
 * @param {Object} props
 * @param {React.ReactNode} props.children - u0421u043eu0434u0435u0440u0436u0438u043cu043eu0435 (u043au0430u0440u0442u043eu0447u043au0438)
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @param {Object} props.style - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 inline u0441u0442u0438u043bu0438
 * @returns {React.ReactElement}
 */
export function CardGroup({ children, className = '', style = {} }) {
  return (
    <div className={`card-group ${className}`} style={style}>
      {children}
    </div>
  );
}

export default Card;
