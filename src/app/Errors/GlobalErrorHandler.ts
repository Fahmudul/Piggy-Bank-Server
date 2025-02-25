import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const GlobalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({ success: false, message, error: err });
};
