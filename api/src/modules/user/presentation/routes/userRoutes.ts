import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../../../../infra/http/middlewares/authMiddleware";
import { validate } from "../../../../infra/http/middlewares/validateMiddleware";
import { updateUserSchema } from "../../application/dtos/UserDTOs";

export function createUserRouter(userController: UserController): Router {
  const router = Router();

  router.get("/users", authMiddleware, userController.getProfile);

  router.put(
    "/users",
    authMiddleware,
    validate(updateUserSchema),
    userController.update,
  );

  router.delete("/users", authMiddleware, userController.delete);

  return router;
}
