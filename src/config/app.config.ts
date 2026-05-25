import type { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { httpLogger } from "./logger.js";

export const applyAppConfig = (app: Express): void => {
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(httpLogger);
};
