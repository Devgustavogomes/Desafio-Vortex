import { MongoOrderRepository } from "./infra/repositories/MongoOrderRepository";
import { MongoItemRepository } from "../items/infra/repositories/MongoItemRepository";
import { MongoUserRepository } from "../user/infra/repositories/MongoUserRepository";
import { CreateOrderUseCase } from "./application/useCases/CreateOrderUseCase";
import { ListOrdersUseCase } from "./application/useCases/ListOrdersUseCase";
import { GetOrderByIdUseCase } from "./application/useCases/GetOrderByIdUseCase";
import { AcceptOrderUseCase } from "./application/useCases/AcceptOrderUseCase";
import { RejectOrderUseCase } from "./application/useCases/RejectOrderUseCase";
import { OrderController } from "./presentation/controllers/OrderController";
import { createOrderRouter } from "./presentation/routes/orderRoutes";

const orderRepository = new MongoOrderRepository();
const itemRepository = new MongoItemRepository();
const userRepository = new MongoUserRepository();

const createOrderUseCase = new CreateOrderUseCase(orderRepository, itemRepository);
const listOrdersUseCase = new ListOrdersUseCase(orderRepository);
const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
const acceptOrderUseCase = new AcceptOrderUseCase(orderRepository, itemRepository);
const rejectOrderUseCase = new RejectOrderUseCase(orderRepository, itemRepository);

const orderController = new OrderController(
  createOrderUseCase,
  listOrdersUseCase,
  getOrderByIdUseCase,
  acceptOrderUseCase,
  rejectOrderUseCase,
  userRepository,
);

export const orderRouter = createOrderRouter(orderController);

