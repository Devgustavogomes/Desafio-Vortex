import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/infra/config/env";
import { UnauthorizedError } from "@/shared/errors";
import type { AuthenticatedRequest } from "@/infra/http/types/express.d";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthorizedError("Token não fornecido"));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      userId: string;
    };
    (req as AuthenticatedRequest).userId = payload.userId;
    next();
  } catch {
    next(new UnauthorizedError("Token inválido ou expirado"));
  }
}
