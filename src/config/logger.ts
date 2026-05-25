import pino from "pino";
import pinoHttpImport from "pino-http";

const pinoHttp = pinoHttpImport.default;

const isProduction = process.env.NODE_ENV === "production";

const loggerOptions = isProduction
  ? {
      level: "info" as const,
    }
  : {
      level: "debug" as const,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          singleLine: true,
          translateTime: "SYS:standard",
        },
      },
    };

export const logger = pino(loggerOptions);

export const httpLogger = pinoHttp({
  logger,
});
