import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  data?: T,
  message?: string,
  meta?: ApiResponse<T>['meta']
): void => {
  const response: ApiResponse<T> = { success };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  meta?: ApiResponse<T>['meta']
): void => {
  sendResponse(res, statusCode, true, data, message, meta);
};

export const sendError = (
  res: Response,
  message: string = 'Error',
  statusCode: number = 500,
  data?: any
): void => {
  sendResponse(res, statusCode, false, data, message);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): void => {
  const totalPages = Math.ceil(total / limit);
  sendSuccess(res, data, message, 200, { page, limit, total, totalPages });
};