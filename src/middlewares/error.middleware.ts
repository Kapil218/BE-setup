import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (typeof next !== "function") {
    return;
  }

  const request = req as Request & {
    log?: {
      error: (payload: Record<string, unknown>, message?: string) => void;
    };
  };

  request.log?.error({ err: err as Record<string, unknown> }, "Request failed");

  if (err instanceof ZodError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiResponse(
          StatusCodes.BAD_REQUEST,
          err.flatten(),
          "Validation failed",
          false,
        ),
      );
  }

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, err.data, err.message, false));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = err as Prisma.PrismaClientKnownRequestError;

    if (prismaError.code === "P2002") {
      return res
        .status(StatusCodes.CONFLICT)
        .json(
          new ApiResponse(
            StatusCodes.CONFLICT,
            null,
            "A record with the same unique value already exists",
            false,
          ),
        );
    }

    if (prismaError.code === "P2021") {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            null,
            "Database table not found. Run Prisma migration or db push first.",
            false,
          ),
        );
    }

    if (prismaError.code === "P2025") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiResponse(
            StatusCodes.NOT_FOUND,
            null,
            "The requested resource was not found",
            false,
          ),
        );
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json(
        new ApiResponse(
          StatusCodes.SERVICE_UNAVAILABLE,
          null,
          "Database connection failed. Make sure PostgreSQL is running and DATABASE_URL is correct.",
          false,
        ),
      );
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      new ApiResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        false,
      ),
    );
};
