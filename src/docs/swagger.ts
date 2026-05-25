import swaggerJsdoc from "swagger-jsdoc";

type SwaggerOptions = {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
    servers: Array<{
      url: string;
    }>;
  };
  apis: string[];
};

const options: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "NodeBE API",
      version: "1.0.0",
      description: "Backend API documentation",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["./src/modules/**/*.ts"],
};

export const specs = swaggerJsdoc(options);
