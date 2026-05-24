import React from 'react';

interface BadgeProps { children: React.ReactNode; variant?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'gray'; size?: 'sm' | 'md'; }

const variants = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  purple: 'bg-violet-50 text-violet-700 border-violet-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  gray: 'bg-gray-50 text-gray-600 border-gray-100',
};

const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1' };

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${variants[variant]} ${sizes[size]}`}>
    {children}
  </span>
);
