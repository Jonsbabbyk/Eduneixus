import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function Card({ children, className = '', onClick }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-200';
  const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';
  
  return (
    <div 
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;