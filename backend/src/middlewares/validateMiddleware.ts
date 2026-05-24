import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse";
import { StatusCode } from "../utils/enums";
import { GeneralMessages } from "../utils/constants";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCode.BAD_REQUEST).json(
      ApiResponse.error(
        GeneralMessages.VALIDATION_ERROR,
        errors.array().map((e) => ({ field: e.type, message: e.msg })),
      ),
    );
    return;
  }
  next();
};
