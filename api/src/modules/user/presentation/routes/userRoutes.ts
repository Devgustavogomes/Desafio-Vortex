import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "@/infra/http/middlewares/authMiddleware";
import { validate } from "@/infra/http/middlewares/validateMiddleware";
import { UpdateUserSchema } from "../../application/dtos/UserDTOs";

export function createUserRouter(userController: UserController): Router {
  const router = Router();

  router.get("/user", authMiddleware, userController.getUser);

  router.put(
    "/user",
    authMiddleware,
    validate(UpdateUserSchema),
    userController.updateUser,
  );

  router.delete("/user", authMiddleware, userController.deleteUser);

  return router;
}
