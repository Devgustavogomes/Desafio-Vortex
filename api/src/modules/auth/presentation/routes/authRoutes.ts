import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../../../../infra/http/middlewares/validateMiddleware";
import { RegisterSchema, LoginSchema } from "../../application/dtos/AuthDTOs";

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/auth/register", validate(RegisterSchema), authController.register);
  router.post("/auth/login", validate(LoginSchema), authController.login);
  router.post("/auth/refresh", authController.refresh);
  router.post("/auth/logout", authController.logout);

  return router;
}
