import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, trend, trendValue, icon, color = 'blue' }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        {icon && <div className="stat-icon-wrapper">{icon}</div>}
      </div>
      
      <div className="stat-content">
        <h2 className="stat-value">{value}</h2>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
      
      {trend && (
        <div className="stat-footer">
          <span className={`stat-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </span>
          <span className="trend-text">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
