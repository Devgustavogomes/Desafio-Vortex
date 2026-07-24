import { MongoUserRepository } from "./infra/repositories/MongoUserRepository";
import { GetCurrentUserUseCase } from "./application/useCases/GetCurrentUserUseCase";
import { UpdateCurrentUserUseCase } from "./application/useCases/UpdateCurrentUserUseCase";
import { DeleteCurrentUserUseCase } from "./application/useCases/DeleteCurrentUserUseCase";
import { UserController } from "./presentation/controllers/UserController";
import { createUserRouter } from "./presentation/routes/userRoutes";

const userRepository = new MongoUserRepository();

const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
const updateCurrentUserUseCase = new UpdateCurrentUserUseCase(userRepository);
const deleteCurrentUserUseCase = new DeleteCurrentUserUseCase(userRepository);

const userController = new UserController(
  getCurrentUserUseCase,
  updateCurrentUserUseCase,
  deleteCurrentUserUseCase,
);

export const userRouter = createUserRouter(userController);
