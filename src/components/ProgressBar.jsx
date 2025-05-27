import React from 'react';
import './ProgressBar.css';

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u0430 u0441 u043fu043eu0434u0434u0435u0440u0436u043au043eu0439 u0442u0435u043cu043du043eu0439/u0441u0432u0435u0442u043bu043eu0439 u0442u0435u043cu044b
 * @param {Object} props
 * @param {number} props.value - u0422u0435u043au0443u0449u0435u0435 u0437u043du0430u0447u0435u043du0438u0435 (0-100)
 * @param {number} props.max - u041cu0430u043au0441u0438u043cu0430u043bu044cu043du043eu0435 u0437u043du0430u0447u0435u043du0438u0435 (u043fu043e u0443u043cu043eu043bu0447u0430u043du0438u044e 100)
 * @param {string} props.label - u041du0430u0434u043fu0438u0441u044c u043du0430u0434 u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u043eu043c (u043eu043fu0446u0438u043eu043du0430u043bu044cu043du043e)
 * @param {boolean} props.showPercent - u041fu043eu043au0430u0437u044bu0432u0430u0442u044c u043fu0440u043eu0446u0435u043du0442 u0432u044bu043fu043eu043bu043du0435u043du0438u044f
 * @param {string} props.color - u0426u0432u0435u0442 u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u0430 (primary, success, warning, danger, info)
 * @param {string} props.size - u0420u0430u0437u043cu0435u0440 u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u0430 (small, medium, large)
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showPercent = false, 
  color = 'primary', 
  size = 'medium', 
  className = '',
  ...props 
}) {
  // u0412u044bu0447u0438u0441u043bu044fu0435u043c u043fu0440u043eu0446u0435u043du0442 u0432u044bu043fu043eu043bu043du0435u043du0438u044f
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`progress-container ${className}`} {...props}>
      {label && <div className="progress-label">{label}</div>}
      <div className={`progress-bar-wrapper ${size}`}>
        <div 
          className={`progress-bar ${color}`} 
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={max}
        ></div>
      </div>
      {showPercent && <div className="progress-percent">{Math.round(percent)}%</div>}
    </div>
  );
}

/**
 * u041au043eu043cu043fu043eu043du0435u043du0442 u043au0440u0443u0433u043eu0432u043eu0433u043e u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u0430
 * @param {Object} props
 * @param {number} props.value - u0422u0435u043au0443u0449u0435u0435 u0437u043du0430u0447u0435u043du0438u0435 (0-100)
 * @param {number} props.max - u041cu0430u043au0441u0438u043cu0430u043bu044cu043du043eu0435 u0437u043du0430u0447u0435u043du0438u0435 (u043fu043e u0443u043cu043eu043bu0447u0430u043du0438u044e 100)
 * @param {string} props.label - u041du0430u0434u043fu0438u0441u044c u0432 u0446u0435u043du0442u0440u0435 (u043eu043fu0446u0438u043eu043du0430u043bu044cu043du043e)
 * @param {string} props.color - u0426u0432u0435u0442 u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u0430 (primary, success, warning, danger, info)
 * @param {number} props.size - u0420u0430u0437u043cu0435u0440 u0432 u043fu0438u043au0441u0435u043bu044fu0445 (u043fu043e u0443u043cu043eu043bu0447u0430u043du0438u044e 100)
 * @param {number} props.thickness - u0422u043eu043bu0449u0438u043du0430 u043bu0438u043du0438u0438 (u043fu043e u0443u043cu043eu043bu0447u0430u043du0438u044e 8)
 * @param {string} props.className - u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0435 u043au043bu0430u0441u0441u044b CSS
 * @returns {React.ReactElement}
 */
export function CircularProgress({ 
  value, 
  max = 100, 
  label, 
  color = 'primary', 
  size = 100, 
  thickness = 8,
  className = '',
  ...props 
}) {
  // u0412u044bu0447u0438u0441u043bu044fu0435u043c u043fu0440u043eu0446u0435u043du0442 u0432u044bu043fu043eu043bu043du0435u043du0438u044f
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  
  // u0412u044bu0447u0438u0441u043bu044fu0435u043c u043fu0430u0440u0430u043cu0435u0442u0440u044b u043au0440u0443u0433u0430
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  
  return (
    <div 
      className={`circular-progress ${color} ${className}`} 
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* u0424u043eu043du043eu0432u044bu0439 u043au0440u0443u0433 */}
        <circle 
          className="circular-progress-background"
          cx={size / 2} 
          cy={size / 2} 
          r={radius}
          strokeWidth={thickness}
          fill="none"
        />
        {/* u041fu0440u043eu0433u0440u0435u0441u0441 */}
        <circle 
          className="circular-progress-value"
          cx={size / 2} 
          cy={size / 2} 
          r={radius}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label && <div className="circular-progress-label">{label}</div>}
    </div>
  );
}

export default ProgressBar;
