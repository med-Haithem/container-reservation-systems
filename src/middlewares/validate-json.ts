import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";

export const validateJson = async (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    throw new ErrorHandler(err.message, 400);
  }
  return next();
};
