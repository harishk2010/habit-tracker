import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
  ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300 bg-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon,
  fullWidth = false, children, disabled, className = '', ...props
}) => (
  <button
    {...props}
    disabled={disabled || isLoading}
    className={`
      inline-flex items-center justify-center gap-2 font-medium rounded-xl
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]}
      ${fullWidth ? 'w-full' : ''} ${className}
    `}
  >
    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
    {children}
    {!isLoading && rightIcon}
  </button>
);
