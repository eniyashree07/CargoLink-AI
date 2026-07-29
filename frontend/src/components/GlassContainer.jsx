import React from 'react';
import './GlassContainer.css';

const GlassContainer = ({ children, className = '', dark = false, style }) => {
  const containerClass = dark ? 'glass-container dark' : 'glass-container';
  
  return (
    <div className={`${containerClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default GlassContainer;
