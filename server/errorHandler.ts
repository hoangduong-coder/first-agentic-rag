import { Request, Response } from "express";

export interface AppError extends Error {
  statusCode: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response
) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};
