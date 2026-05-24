import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: { value: number; label: string; positive?: boolean };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title, value, subtitle, icon: Icon, iconColor, iconBg, trend
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1.5 text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-1.5">
        <span className={`text-sm font-semibold ${trend.positive !== false ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend.positive !== false ? '+' : ''}{trend.value}%
        </span>
        <span className="text-sm text-gray-400">{trend.label}</span>
      </div>
    )}
  </div>
);
