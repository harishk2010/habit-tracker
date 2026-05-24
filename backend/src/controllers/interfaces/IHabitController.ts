import { Request, Response, NextFunction } from 'express';
export interface IHabitController {
  createHabit(req: Request, res: Response, next: NextFunction): Promise<void>;
  getHabits(req: Request, res: Response, next: NextFunction): Promise<void>;
  getHabitById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateHabit(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteHabit(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleCompletion(req: Request, res: Response, next: NextFunction): Promise<void>;
  getHabitLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
