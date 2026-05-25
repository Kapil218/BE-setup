import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse.js";
import v1Routes from "./v1/index.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
      "Service is healthy",
    ),
  );
});

router.use("/v1", v1Routes);

export default router;
