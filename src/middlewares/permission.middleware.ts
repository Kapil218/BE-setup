import type { RequestHandler } from "express";

export const permissionMiddleware =
  (_permissions: readonly string[]): RequestHandler =>
  (_req, _res, next) => {
    void _permissions;
    next();
  };
