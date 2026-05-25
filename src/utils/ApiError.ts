export class ApiError extends Error {
  statusCode: number;

  data: unknown;

  errors: unknown;

  success: boolean;

  constructor(
    statusCode: number,
    message: string,
    data: unknown = null,
    errors: unknown = null,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = data;
    this.errors = errors;
    this.success = false;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, this.constructor);
  }
}
