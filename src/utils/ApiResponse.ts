export class ApiResponse<T> {
  success: boolean;

  constructor(
    public statusCode: number,
    public data: T,
    public message = "Success",
    success = true,
  ) {
    this.success = success;
  }
}
