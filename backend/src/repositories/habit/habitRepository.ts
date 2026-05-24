import { GenericRepository } from "../GenericRepository";
import { IHabitRepository } from "../interfaces/IHabitRepository";
import { IHabit, HabitModel } from "../../models/habitModel";

export class HabitRepository
  extends GenericRepository<IHabit>
  implements IHabitRepository
{
  constructor() {
    super(HabitModel);
  }

  async findByUserId(userId: string): Promise<IHabit[]> {
    return (await this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean()) as unknown as IHabit[];
  }

  async findActiveByUserId(userId: string): Promise<IHabit[]> {
    return (await this.model
      .find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .lean()) as unknown as IHabit[];
  }

  async incrementStreak(
    id: string,
    currentStreak: number,
    longestStreak: number,
    totalCompletions: number,
  ): Promise<IHabit | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: { currentStreak, longestStreak, totalCompletions } },
      { new: true },
    );
  }

  async resetStreak(id: string): Promise<IHabit | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: { currentStreak: 0 } },
      { new: true },
    );
  }
}
