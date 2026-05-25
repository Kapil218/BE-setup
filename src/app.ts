import express from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/swagger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "./utils/ApiResponse.js";
import { applyAppConfig } from "./config/app.config.js";
import { apiRateLimitMiddleware } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

applyAppConfig(app);

app.use("/api", apiRateLimitMiddleware, apiRoutes);

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
