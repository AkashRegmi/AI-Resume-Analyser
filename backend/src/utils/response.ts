import { Response } from "express";
import { ApiResponse } from "../types/apiResponse";
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data,
  });
};
export const sendSuccessWithPagination = <T>(
  res: Response,
  statusCode: number,
  message: string,
  page: number,
  limit: number,
  totalPage: number,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    pagination: {
      page,
      limit,
      totalPage,
    },
    data,
  });
};
export const sendError = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    data,
  });
};