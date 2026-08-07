import { MongoUserRepository } from "./infra/repositories/MongoUserRepository";
import { GetUserProfileUseCase } from "./application/useCases/GetUserProfileUseCase";
import { UpdateUserUseCase } from "./application/useCases/UpdateUserUseCase";
import { DeleteUserUseCase } from "./application/useCases/DeleteUserUseCase";
import { UserController } from "./presentation/controllers/UserController";
import { createUserRouter } from "./presentation/routes/userRoutes";

const userRepository = new MongoUserRepository();

const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const userController = new UserController(
  getUserProfileUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

export const userRouter = createUserRouter(userController);
