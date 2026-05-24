import mongoose, { Document, Schema } from 'mongoose';

export interface IHabitLog extends Document {
  habitId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  completedAt: Date;
  note?: string;
  createdAt: Date;
}

const habitLogSchema = new Schema<IHabitLog>(
  {
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    completedAt: { type: Date, required: true, default: Date.now },
    note: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

habitLogSchema.index({ habitId: 1, completedAt: -1 });
habitLogSchema.index({ userId: 1, completedAt: -1 });

export const HabitLogModel = mongoose.model<IHabitLog>('HabitLog', habitLogSchema);
