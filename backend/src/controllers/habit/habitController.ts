import { Request, Response, NextFunction } from 'express';
import { IHabitController } from '../interfaces/IHabitController';
import { IHabitService } from '../../services/interfaces/IHabitService';
import { ApiResponse } from '../../utils/ApiResponse';
import { HabitMessages } from '../../utils/constants';
import { StatusCode } from '../../utils/enums';

export class HabitController implements IHabitController {
  private habitService: IHabitService;

  constructor(habitService: IHabitService) {
    this.habitService = habitService;
    this.createHabit = this.createHabit.bind(this);
    this.getHabits = this.getHabits.bind(this);
    this.getHabitById = this.getHabitById.bind(this);
    this.updateHabit = this.updateHabit.bind(this);
    this.deleteHabit = this.deleteHabit.bind(this);
    this.toggleCompletion = this.toggleCompletion.bind(this);
    this.getHabitLogs = this.getHabitLogs.bind(this);
  }

  async createHabit(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const habit = await this.habitService.createHabit(req.user!.id, req.body);
      res
        .status(StatusCode.CREATED)
        .json(ApiResponse.success(HabitMessages.CREATED, { habit }));
    } catch (error) {
      next(error);
    }
  }

  async getHabits(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const habits = await this.habitService.getHabits(req.user!.id);
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(HabitMessages.FETCHED, { habits }));
    } catch (error) {
      next(error);
    }
  }

  async getHabitById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const habit = await this.habitService.getHabitById(
        req.params.id,
        req.user!.id,
      );
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(HabitMessages.SINGLE_FETCHED, { habit }));
    } catch (error) {
      next(error);
    }
  }

  async updateHabit(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const habit = await this.habitService.updateHabit(
        req.params.id,
        req.user!.id,
        req.body,
      );
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(HabitMessages.UPDATED, { habit }));
    } catch (error) {
      next(error);
    }
  }

  async deleteHabit(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.habitService.deleteHabit(req.params.id, req.user!.id);
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(HabitMessages.DELETED));
    } catch (error) {
      next(error);
    }
  }

  async toggleCompletion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.habitService.toggleHabitCompletion(
        req.params.id,
        req.user!.id,
      );
      const message = result.completed
        ? HabitMessages.COMPLETED
        : HabitMessages.UNCOMPLETED;
      res.status(StatusCode.OK).json(ApiResponse.success(message, result));
    } catch (error) {
      next(error);
    }
  }

  async getHabitLogs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const logs = await this.habitService.getHabitLogs(
        req.params.id,
        req.user!.id,
      );
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success("Logs fetched", { logs }));
    } catch (error) {
      next(error);
    }
  }
}
