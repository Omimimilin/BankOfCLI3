type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; errors: string[] };

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
