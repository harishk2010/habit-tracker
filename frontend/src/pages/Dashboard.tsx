import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, CheckCircle2, Flame, Trophy, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { StatsCard } from '../components/dashboard/StatsCard';
import { WeeklyChart } from '../components/dashboard/WeeklyChart';
import { HabitStreakCard } from '../components/dashboard/HabitStreakCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    refetchInterval: 60_000,
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  );

  if (isError || !data) return (
    <div className="text-center py-16 text-gray-500">
      <p>Failed to load dashboard. Please refresh.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/habits">
          <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">New Habit</Button>
        </Link>
      </div>

      {/* Today's summary card */}
      {data.totalHabits > 0 && (
        <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-200 text-sm font-medium">Today's Progress</p>
              <p className="text-3xl font-bold mt-1">
                {data.completedToday} <span className="text-primary-300 text-xl font-normal">/ {data.totalHabits}</span>
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold">{data.completionRate}%</span>
            </div>
          </div>
          <ProgressBar value={data.completionRate} color="rgba(255,255,255,0.9)" size="md" />
          <p className="mt-2 text-primary-200 text-sm">
            {data.completionRate === 100
              ? '🎉 Perfect day! All habits completed!'
              : data.completionRate >= 50
              ? '💪 Great progress, keep going!'
              : 'You can do it! Start checking off habits.'}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Habits" value={data.totalHabits} subtitle="active habits"
          icon={Target} iconColor="text-primary-600" iconBg="bg-primary-50"
        />
        <StatsCard
          title="Done Today" value={data.completedToday} subtitle={`of ${data.totalHabits} habits`}
          icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Total Streaks" value={data.totalStreaks} subtitle="combined days"
          icon={Flame} iconColor="text-orange-600" iconBg="bg-orange-50"
        />
        <StatsCard
          title="Longest Streak" value={data.longestStreak} subtitle="personal best"
          icon={Trophy} iconColor="text-yellow-600" iconBg="bg-yellow-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyChart data={data.weeklyProgress} />
        <HabitStreakCard streaks={data.topStreaks} />
      </div>

      {/* Empty state */}
      {data.totalHabits === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            Create your first habit and start building a streak today.
          </p>
          <Link to="/habits">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Create First Habit</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
