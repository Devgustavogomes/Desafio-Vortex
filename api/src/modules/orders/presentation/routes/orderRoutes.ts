import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authMiddleware } from "../../../../infra/http/middlewares/authMiddleware";
import {
  validate,
  validateParams,
  validateQuery,
} from "../../../../infra/http/middlewares/validateMiddleware";
import {
  createOrderSchema,
  listOrdersSchema,
  orderIdParamSchema,
  updateOrderSchema,
} from "../../application/dtos/OrderDTOs";

export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();

  router.post(
    "/orders",
    authMiddleware,
    validate(createOrderSchema),
    orderController.create,
  );

  router.get(
    "/orders",
    authMiddleware,
    validateQuery(listOrdersSchema),
    orderController.list,
  );

  router.get(
    "/orders/:id",
    authMiddleware,
    validateParams(orderIdParamSchema),
    orderController.getById,
  );

  router.put(
    "/orders/:id",
    authMiddleware,
    validateParams(orderIdParamSchema),
    validate(updateOrderSchema),
    orderController.update,
  );

  return router;
}
