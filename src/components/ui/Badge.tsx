import React from 'react';
import style from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'orange';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const combinedClasses = `${style.badge} ${style[variant]} ${className}`;

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
};
