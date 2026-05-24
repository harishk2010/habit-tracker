import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, SlidersHorizontal, Target } from 'lucide-react';
import { habitService } from '../services/habitService';
import { HabitCard } from '../components/habit/HabitCard';
import { HabitForm } from '../components/habit/HabitForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { Habit, CreateHabitInput, HabitCategory } from '../types';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other'] as const;

export const Habits: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | HabitCategory>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getHabits,
  });

  const createMutation = useMutation({
    mutationFn: habitService.createHabit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      setIsCreateOpen(false);
      toast.success('Habit created! 🎯');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create habit'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateHabitInput> }) =>
      habitService.updateHabit(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      setEditingHabit(null);
      toast.success('Habit updated!');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: habitService.deleteHabit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Habit deleted');
    },
    onError: () => toast.error('Failed to delete habit'),
  });

  const toggleMutation = useMutation({
    mutationFn: habitService.toggleCompletion,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.completed ? `✅ Habit completed! 🔥 ${res.habit.currentStreak} day streak` : 'Marked as incomplete');
      setTogglingId(null);
    },
    onError: () => { toast.error('Failed to toggle'); setTogglingId(null); },
  });

  const handleToggle = (id: string) => {
    setTogglingId(id);
    toggleMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this habit and all its logs?')) deleteMutation.mutate(id);
  };

  const habits = data || [];
  const filtered = habits.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === 'all' || h.category === filter;
    return matchesSearch && matchesCategory;
  });

  const completedCount = habits.filter((h) => h.completedToday).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-400 mt-0.5">
            {habits.length > 0 ? `${completedCount} of ${habits.length} completed today` : 'Build your first habit'}
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Habit
        </Button>
      </div>

      {/* Search + Filter */}
      {habits.length > 0 && (
        <div className="space-y-3">
          <Input
            placeholder="Search habits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${filter === cat ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Habits Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search || filter !== 'all' ? 'No matching habits' : 'No habits yet'}
          </h3>
          <p className="text-gray-400 mb-6 max-w-xs mx-auto">
            {search || filter !== 'all' ? 'Try a different search or filter.' : 'Create your first habit to get started!'}
          </p>
          {!search && filter === 'all' && (
            <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Create First Habit
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onToggle={handleToggle}
              onEdit={setEditingHabit}
              onDelete={handleDelete}
              isToggling={togglingId === habit._id}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Habit">
        <HabitForm
          onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingHabit} onClose={() => setEditingHabit(null)} title="Edit Habit">
        {editingHabit && (
          <HabitForm
            habit={editingHabit}
            onSubmit={async (data) => { await updateMutation.mutateAsync({ id: editingHabit._id, data }); }}
            onCancel={() => setEditingHabit(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
};
