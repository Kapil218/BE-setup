import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config/env.js";

const options: Parameters<typeof swaggerJsdoc>[0] = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "NodeBE API",
      version: "1.0.0",
      description: "Backend API documentation",
    },

    servers: [
      {
        url: `http://localhost:${env.PORT}`,
      },
    ],
  },

  apis: ["./src/modules/**/routes/*.ts", "./src/routes/**/*.ts"],
};

export const specs = swaggerJsdoc(options);
