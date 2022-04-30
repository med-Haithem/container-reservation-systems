import { Response, NextFunction } from "express";
import config from "../config";
import authService from "../features/auth/auth.service";
import { ErrorHandler, HTTP_STATUS_CODES, verifyJWT } from "../utils";
const { ACCESS_TOKEN_EXPIRES_IN, JWT_ACCESS_TOKEN_SECRET } = config;

export const authGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization") || req.header("authorization");
  if (!token) {
    next(new ErrorHandler("Unathorized", HTTP_STATUS_CODES.UNOOTHORIZD));
  }

  token = token.replace("Bearer ", "");

  try {
    const payload = await verifyJWT({
      token,
      secretKey: JWT_ACCESS_TOKEN_SECRET,
      signOption: {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    });
    req.user = payload;
    req = { ...req, user: payload };
    return next();
  } catch (err) {
    next(new ErrorHandler("Session Timeout", HTTP_STATUS_CODES.UNOOTHORIZD));
  }
  return next();
};
