import React, { useState } from 'react';
import { Flame, Trophy, CheckCircle2, Circle, Pencil, Trash2, MoreVertical, Calendar, BarChart3 } from 'lucide-react';
import { Habit } from '../../types';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  isToggling?: boolean;
}

const categoryColors: Record<string, 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'gray'> = {
  health: 'green', fitness: 'orange', learning: 'blue',
  productivity: 'purple', mindfulness: 'blue', other: 'gray',
};

const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onEdit, onDelete, isToggling }) => {
  const [showMenu, setShowMenu] = useState(false);

  const completionRate = habit.totalCompletions > 0
    ? Math.min(Math.round((habit.totalCompletions / Math.max(1, getDaysSinceCreated(habit.createdAt))) * 100), 100)
    : 0;

  return (
    <div className={`
      bg-white rounded-2xl border transition-all duration-300 group
      ${habit.completedToday ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}
    `}>
      {/* Top accent bar */}
      <div className="h-1 rounded-t-2xl" style={{ backgroundColor: habit.color }} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Toggle + Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => onToggle(habit._id)}
              disabled={isToggling}
              className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
            >
              {habit.completedToday ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 hover:text-primary-400 transition-colors" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{habit.icon}</span>
                <h3 className={`font-semibold text-gray-900 truncate ${habit.completedToday ? 'line-through text-gray-400' : ''}`}>
                  {habit.title}
                </h3>
                <Badge variant={categoryColors[habit.category] || 'gray'}>{habit.category}</Badge>
              </div>
              {habit.description && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">{habit.description}</p>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-36">
                  <button onClick={() => { onEdit(habit); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Pencil className="w-3.5 h-3.5" />Edit
                  </button>
                  <button onClick={() => { onDelete(habit._id); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="font-semibold">{habit.currentStreak}</span>
            <span className="text-gray-400 text-xs">streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-violet-500">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold">{habit.longestStreak}</span>
            <span className="text-gray-400 text-xs">best</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <BarChart3 className="w-4 h-4" />
            <span className="font-semibold">{habit.totalCompletions}</span>
            <span className="text-gray-400 text-xs">done</span>
          </div>
        </div>

        {/* Weekly targets */}
        {habit.frequency === 'weekly' && (
          <div className="mt-3 flex gap-1">
            {dayLabels.map((day, i) => (
              <span key={i} className={`text-xs px-1.5 py-0.5 rounded-md font-medium
                ${habit.targetDays.includes(i) ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 text-gray-300'}`}>
                {day}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="mt-3">
          <ProgressBar value={completionRate} color={habit.color} size="sm" />
        </div>
      </div>
    </div>
  );
};

function getDaysSinceCreated(createdAt: string): number {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
