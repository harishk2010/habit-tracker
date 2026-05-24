import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Habit, CreateHabitInput } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  frequency: z.enum(['daily', 'weekly']),
  targetDays: z.array(z.number()).optional(),
  color: z.string(),
  icon: z.string(),
  category: z.enum(['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other']),
});

type FormData = z.infer<typeof schema>;

const COLORS = ['#6366f1', '#ec4899', '#f97316', '#22c55e', '#14b8a6', '#3b82f6', '#a855f7', '#ef4444'];
const ICONS = ['⭐', '💪', '📚', '🧘', '🏃', '💧', '🎯', '🌱', '🔥', '💡', '🎨', '🍎'];
const CATEGORIES = ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other'] as const;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface HabitFormProps {
  habit?: Habit;
  onSubmit: (data: CreateHabitInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({ habit, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: habit?.title || '',
      description: habit?.description || '',
      frequency: habit?.frequency || 'daily',
      targetDays: habit?.targetDays || [0, 1, 2, 3, 4, 5, 6],
      color: habit?.color || '#6366f1',
      icon: habit?.icon || '⭐',
      category: habit?.category || 'other',
    },
  });

  const frequency = watch('frequency');
  const selectedColor = watch('color');
  const selectedIcon = watch('icon');
  const targetDays = watch('targetDays') || [];

  const toggleDay = (day: number) => {
    const current = targetDays;
    if (current.includes(day)) {
      setValue('targetDays', current.filter((d) => d !== day));
    } else {
      setValue('targetDays', [...current, day].sort());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Habit Title" {...register('title')} error={errors.title?.message} placeholder="e.g. Morning Run" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
        <textarea
          {...register('description')}
          placeholder="What's this habit about?"
          rows={2}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Icon picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
        <div className="flex gap-2 flex-wrap">
          {ICONS.map((icon) => (
            <button key={icon} type="button" onClick={() => setValue('icon', icon)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all
                ${selectedIcon === icon ? 'bg-primary-100 ring-2 ring-primary-500' : 'bg-gray-50 hover:bg-gray-100'}`}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button key={color} type="button" onClick={() => setValue('color', color)}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
              style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} type="button" onClick={() => setValue('category', cat)}
              className={`py-2 px-3 rounded-xl text-sm font-medium capitalize transition-all
                ${watch('category') === cat ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Frequency</label>
        <div className="flex gap-2">
          {(['daily', 'weekly'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setValue('frequency', f)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all
                ${frequency === f ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Target days for weekly */}
      {frequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Days</label>
          <div className="flex gap-2">
            {DAYS.map((day, i) => (
              <button key={i} type="button" onClick={() => toggleDay(i)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
                  ${targetDays.includes(i) ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>Cancel</Button>
        <Button type="submit" isLoading={isLoading} fullWidth>
          {habit ? 'Save Changes' : 'Create Habit'}
        </Button>
      </div>
    </form>
  );
};
