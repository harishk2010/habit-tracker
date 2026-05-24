import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailyStats } from '../../types';
import { format, parseISO } from 'date-fns';

interface WeeklyChartProps { data: DailyStats[]; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-primary-600">{payload[0].value}% completion</p>
        <p className="text-gray-400">{payload[0].payload.completed}/{payload[0].payload.total} habits</p>
      </div>
    );
  }
  return null;
};

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const today = new Date().toISOString().split('T')[0];
  const chartData = data.map((d) => ({
    ...d,
    day: format(parseISO(d.date), 'EEE'),
    isToday: d.date === today,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-1">Weekly Progress</h3>
      <p className="text-sm text-gray-400 mb-6">Your completion rate over the last 7 days</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={32} barCategoryGap="30%">
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="rate" radius={[8, 8, 4, 4]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.isToday ? '#6366f1' : entry.rate > 0 ? '#c7d2fe' : '#f3f4f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
