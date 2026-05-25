import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(
    new ApiError(StatusCodes.NOT_FOUND, `Route ${req.originalUrl} not found`),
  );
};
