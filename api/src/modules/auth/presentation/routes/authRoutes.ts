import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../../../../infra/http/middlewares/validateMiddleware";
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
} from "../../application/dtos/AuthDTOs";

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/register", validate(RegisterSchema), authController.register);
  router.post("/login", validate(LoginSchema), authController.login);
  router.post("/refresh", validate(RefreshTokenSchema), authController.refresh);

  return router;
}
