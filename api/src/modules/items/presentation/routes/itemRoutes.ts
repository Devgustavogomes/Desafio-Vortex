import { Router } from "express";
import { ItemController } from "../controllers/ItemController";
import { authMiddleware } from "../../../../infra/http/middlewares/authMiddleware";
import {
  validate,
  validateParams,
} from "../../../../infra/http/middlewares/validateMiddleware";
import {
  createItemSchema,
  updateItemSchema,
  itemIdParamSchema,
} from "../../application/dtos/ItemDTOs";

export function createItemRouter(itemController: ItemController): Router {
  const router = Router();

  router.get("/items", itemController.listAll);
  router.get(
    "/items/me",
    authMiddleware,
    itemController.listUserItems,
  );
  router.get(
    "/items/:id",
    validateParams(itemIdParamSchema),
    itemController.getById,
  );
  router.post(
    "/items",
    authMiddleware,
    validate(createItemSchema),
    itemController.create,
  );
  router.put(
    "/items/:id",
    authMiddleware,
    validateParams(itemIdParamSchema),
    validate(updateItemSchema),
    itemController.update,
  );
  router.delete(
    "/items/:id",
    authMiddleware,
    validateParams(itemIdParamSchema),
    itemController.delete,
  );

  return router;
}
