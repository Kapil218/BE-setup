import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/swagger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";
import { httpLogger } from "./config/logger.js";
import apiRoutes from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "./utils/ApiResponse.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(httpLogger);

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/api", apiRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      {
        service: "NodeBE API",
        docs: "/api-docs",
        health: "/api/health",
        path: req.originalUrl,
      },
      "Backend running",
    ),
  );
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
