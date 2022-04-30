import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils";

export const handleError = async (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // catch all api errors
  if (err instanceof ErrorHandler) {
    return res.status(err.status).send({
      success: false,
      message: err.message,
    });
  }
  // connect all errors
  return res.status(500).send({
    success: false,
    message: "Something went wrong!",
  });
};
