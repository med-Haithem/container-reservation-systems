import { NextFunction, Request, Response } from "express";

export const expressCallback =
  (controller: any) => async (req: any, res: Response, next: NextFunction) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
        Authorization: req.get("Authorization"),
        Referer: req.get("referer"),
        "User-Agent": req.get("User-Agent"),
      },
      user: req.user,
    };
    try {
      const httpResponse = await controller(httpRequest);

      if (!httpResponse.body)
        return res.status(httpResponse.status).send(httpResponse);
      return res.status(httpResponse.status).send(httpResponse.body);
    } catch (err) {
      next(err);
    }
  };
