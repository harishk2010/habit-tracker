import { Request, Response, NextFunction } from 'express';
import { IDashboardController } from '../interfaces/IDashboardController';
import { IDashboardService } from '../../services/interfaces/IDashboardService';
import { ApiResponse } from '../../utils/ApiResponse';
import { DashboardMessages } from '../../utils/constants';
import { StatusCode } from '../../utils/enums';

export class DashboardController implements IDashboardController {
  private dashboardService: IDashboardService;

  constructor(dashboardService: IDashboardService) {
    this.dashboardService = dashboardService;
    this.getDashboard = this.getDashboard.bind(this);
  }

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.dashboardService.getDashboardData(req.user!.id);
      res.status(StatusCode.OK).json(ApiResponse.success(DashboardMessages.FETCHED, data));
    } catch (error) { next(error); }
  }
}
