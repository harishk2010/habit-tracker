import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <Loader2 className={`animate-spin text-primary-600 ${sizes[size]} ${className}`} />;
};

export const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <Spinner size="lg" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);
