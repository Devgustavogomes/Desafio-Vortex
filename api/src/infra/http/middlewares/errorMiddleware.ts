import type { Request, Response, NextFunction } from "express";
import { BaseError } from "@/shared/errors";
import { logger } from "@/infra/logger/logger";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  logger.error({ err }, "Unhandled error");

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    statusCode: 500,
  });
}
