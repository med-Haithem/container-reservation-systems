import { Response } from "express";

export enum HTTP_STATUS_CODES {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNOOTHORIZD = 403,
  INTERNAL_SERVER = 500,
}

export class ErrorHandler extends Error {
  status: HTTP_STATUS_CODES;
  constructor(message: string, status: HTTP_STATUS_CODES) {
    super(message);
    Object.setPrototypeOf(this, ErrorHandler.prototype);
    this.status = status;
  }
}
