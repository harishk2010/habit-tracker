import React from 'react';

interface ProgressBarProps { value: number; max?: number; color?: string; size?: 'sm' | 'md'; label?: string; showValue?: boolean; }

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, color = '#6366f1', size = 'md', label, showValue = false }) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5' };
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-gray-700">{pct}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
