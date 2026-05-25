import type { Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";

type ValidationSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validate =
  ({ body, params, query }: ValidationSchemas): RequestHandler =>
  (req, res: Response, next) => {
    try {
      const request = req as Request & {
        body: unknown;
        params: Record<string, unknown>;
        query: Record<string, unknown>;
      };

      if (body) {
        request.body = body.parse(request.body);
      }

      if (params) {
        request.params = params.parse(request.params) as Request["params"];
      }

      if (query) {
        res.locals.validatedQuery = query.parse(request.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
