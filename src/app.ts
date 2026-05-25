import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/swagger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import pinoHttpImport from "pino-http";

const pinoHttp = pinoHttpImport.default;

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(compression());

const logger =
  process.env.NODE_ENV !== "production"
    ? pinoHttp({
        transport: {
          target: "pino-pretty",
        },
      })
    : pinoHttp();

app.use(logger);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Backend running",
  });
});

app.use(errorMiddleware);

export default app;
