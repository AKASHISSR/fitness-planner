import React from 'react';
import './StatusBadge.css';

function StatusBadge({ type, text }) {
  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'status-success';
      case 'warning':
        return 'status-warning';
      case 'danger':
        return 'status-danger';
      case 'info':
        return 'status-info';
      case 'primary':
        return 'status-primary';
      default:
        return 'status-default';
    }
  };

  return (
    <span className={`status-badge ${getTypeClass()}`}>
      {text}
    </span>
  );
}

export default StatusBadge;
