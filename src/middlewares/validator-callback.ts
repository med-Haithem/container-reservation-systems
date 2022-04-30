import { NextFunction, Request, Response } from "express";
import { ErrorHandler, HTTP_STATUS_CODES } from "../utils";

export const validatorCallback =
  (validator: any) => (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
    };
    const { error } = validator(httpRequest);
    if (error)
      throw new ErrorHandler(error.message, HTTP_STATUS_CODES.BAD_REQUEST);
    return next();
  };
