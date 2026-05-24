import React from 'react';

interface CardProps { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void; }

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => (
  <div
    onClick={onClick}
    className={`
      bg-white rounded-2xl border border-gray-100 shadow-sm
      ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 pt-6 pb-4 ${className}`}>{children}</div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);
