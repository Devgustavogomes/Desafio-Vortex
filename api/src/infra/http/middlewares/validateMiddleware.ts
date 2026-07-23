import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ValidationError } from "@/shared/errors";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new ValidationError("Validation failed", result.error.issues));
      return;
    }

    req.body = result.data;
    next();
  };
}
