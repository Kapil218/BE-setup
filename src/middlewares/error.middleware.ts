import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  void _next;

  res.status(500).json({
    success: false,
    message: err.message,
  });
};
