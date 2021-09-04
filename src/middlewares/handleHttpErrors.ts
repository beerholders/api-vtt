import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export async function handleHttpErrors(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (createError.isHttpError(err)) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return next(err);
}
