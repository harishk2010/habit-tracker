import { IHabitLog } from '../models/habitLogModel';

export const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const isToday = (date: Date): boolean => isSameDay(date, new Date());

export const calculateStreak = (logs: IHabitLog[]): { currentStreak: number; longestStreak: number } => {
  if (!logs.length) return { currentStreak: 0, longestStreak: 0 };

  const sortedDates = logs
    .map((l) => startOfDay(new Date(l.completedAt)))
    .sort((a, b) => b.getTime() - a.getTime());

  // Deduplicate by day
  const uniqueDates: Date[] = [];
  sortedDates.forEach((d) => {
    if (!uniqueDates.length || !isSameDay(d, uniqueDates[uniqueDates.length - 1])) {
      uniqueDates.push(d);
    }
  });

  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Current streak must include today or yesterday
  let currentStreak = 0;
  const mostRecent = uniqueDates[0];
  if (!isSameDay(mostRecent, today) && !isSameDay(mostRecent, yesterday)) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const expected = new Date(uniqueDates[i - 1]);
      expected.setDate(expected.getDate() - 1);
      if (isSameDay(uniqueDates[i], expected)) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Longest streak
  let longestStreak = uniqueDates.length > 0 ? 1 : 0;
  let tempStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const expected = new Date(uniqueDates[i - 1]);
    expected.setDate(expected.getDate() - 1);
    if (isSameDay(uniqueDates[i], expected)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak };
};

export const getWeekDates = (): Date[] => {
  const dates: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(startOfDay(d));
  }
  return dates;
};
