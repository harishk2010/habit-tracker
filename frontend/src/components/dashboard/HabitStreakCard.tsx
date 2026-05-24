import React from 'react';
import { Flame } from 'lucide-react';
import { HabitStreak } from '../../types';

interface HabitStreakCardProps { streaks: HabitStreak[]; }

export const HabitStreakCard: React.FC<HabitStreakCardProps> = ({ streaks }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">
    <h3 className="text-base font-semibold text-gray-900 mb-1">Top Streaks</h3>
    <p className="text-sm text-gray-400 mb-5">Your best running habits</p>
    {streaks.length === 0 ? (
      <div className="text-center py-8 text-gray-400">
        <Flame className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Complete habits to build streaks!</p>
      </div>
    ) : (
      <div className="space-y-3">
        {streaks.map((s, i) => (
          <div key={s.habitId} className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300 w-4">#{i + 1}</span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: s.color + '20' }}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({ length: Math.min(s.currentStreak, 10) }).map((_, j) => (
                  <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                ))}
                {s.currentStreak > 10 && <span className="text-xs text-gray-400">+{s.currentStreak - 10}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="font-bold text-sm">{s.currentStreak}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
