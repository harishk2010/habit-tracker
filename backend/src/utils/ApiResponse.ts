export class ApiResponse {
  static success<T>(message: string, data?: T, meta?: object) {
    return {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    };
  }

  static error(message: string, errors?: unknown) {
    return {
      success: false,
      message,
      ...(errors !== undefined && { errors }),
    };
  }
}
