import swaggerJsdoc from "swagger-jsdoc";

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
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["./src/controllers/**/*.ts", "./src/routes/**/*.ts"],
};

export const specs = swaggerJsdoc(options);
