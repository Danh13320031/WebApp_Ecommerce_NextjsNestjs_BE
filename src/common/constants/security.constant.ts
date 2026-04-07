export const SART_ROUNDS_SECURITY: number = 10;
export const JWT_SECRET_SECURITY: string = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN_SECURITY: string = process.env
  .JWT_EXPIRES_IN as string;
export const JWT_REFRESH_SECRET_SECURITY: string = process.env
  .JWT_REFRESH_SECRET as string;
export const CORS_METHODS_SECURITY: string[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
];
export const CORS_ALLOWED_HEADERS_SECURITY: string[] = [
  'Content-Type',
  'Authorization',
  'Accept',
];
