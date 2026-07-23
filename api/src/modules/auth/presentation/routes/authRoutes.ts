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

  router.post(
    "/register",
    validate(RegisterSchema),
    authController.register.bind(authController),
  );
  router.post(
    "/login",
    validate(LoginSchema),
    authController.login.bind(authController),
  );
  router.post(
    "/refresh",
    validate(RefreshTokenSchema),
    authController.refresh.bind(authController),
  );

  return router;
}
