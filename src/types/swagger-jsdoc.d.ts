declare module "swagger-jsdoc" {
  export interface SwaggerJsdocOptions {
    definition?: {
      openapi?: string;
      info?: {
        title?: string;
        version?: string;
        description?: string;
      };
      servers?: Array<{
        url?: string;
      }>;
    };
    apis?: string[];
  }

  export default function swaggerJsdoc(
    options?: SwaggerJsdocOptions,
  ): Record<string, unknown>;
}
