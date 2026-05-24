import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  targetDays: number[];
  color: string;
  icon: string;
  category: 'health' | 'fitness' | 'learning' | 'productivity' | 'mindfulness' | 'other';
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    targetDays: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
    color: { type: String, default: '#6366f1' },
    icon: { type: String, default: '⭐' },
    category: {
      type: String,
      enum: ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other'],
      default: 'other',
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalCompletions: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

habitSchema.index({ userId: 1, isActive: 1 });

export const HabitModel = mongoose.model<IHabit>('Habit', habitSchema);
