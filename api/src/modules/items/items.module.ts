import { MongoItemRepository } from "./infra/repositories/MongoItemRepository";
import { CreateItemUseCase } from "./application/useCases/CreateItemUseCase";
import { ListAllItemsUseCase } from "./application/useCases/ListAllItemsUseCase";
import { GetItemByIdUseCase } from "./application/useCases/GetItemByIdUseCase";
import { UpdateItemUseCase } from "./application/useCases/UpdateItemUseCase";
import { DeleteItemUseCase } from "./application/useCases/DeleteItemUseCase";
import { ListUserItemsUseCase } from "./application/useCases/ListUserItemsUseCase";
import { ItemController } from "./presentation/controllers/ItemController";
import { createItemRouter } from "./presentation/routes/itemRoutes";

const itemRepository = new MongoItemRepository();

const createItemUseCase = new CreateItemUseCase(itemRepository);
const listAllItemsUseCase = new ListAllItemsUseCase(itemRepository);
const getItemByIdUseCase = new GetItemByIdUseCase(itemRepository);
const updateItemUseCase = new UpdateItemUseCase(itemRepository);
const deleteItemUseCase = new DeleteItemUseCase(itemRepository);
const listUserItemsUseCase = new ListUserItemsUseCase(itemRepository);

const itemController = new ItemController(
  createItemUseCase,
  listAllItemsUseCase,
  getItemByIdUseCase,
  updateItemUseCase,
  deleteItemUseCase,
  listUserItemsUseCase,
);

export const itemRouter = createItemRouter(itemController);
