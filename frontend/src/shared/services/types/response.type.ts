export interface ApiResponse<T> {
  data: T;
  meta: {
    statusCode: number;
    message: string;
  };
}
