import { RedisRefreshTokenRepository } from './infra/repositories/RedisRefreshTokenRepository';
import { TokenService } from './application/services/TokenService';
import { RegisterUseCase } from './application/useCases/RegisterUseCase';
import { LoginUseCase } from './application/useCases/LoginUseCase';
import { RefreshTokenUseCase } from './application/useCases/RefreshTokenUseCase';
import { AuthController } from './presentation/controllers/AuthController';
import { createAuthRouter } from './presentation/routes/authRoutes';
import { MongoUserRepository } from '../user/infra/repositories/MongoUserRepository';

const tokenService = new TokenService();
const refreshTokenRepository = new RedisRefreshTokenRepository();
const userRepository = new MongoUserRepository();

const registerUseCase = new RegisterUseCase(userRepository, refreshTokenRepository, tokenService);
const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, tokenService);
const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, tokenService);

const authController = new AuthController(registerUseCase, loginUseCase, refreshTokenUseCase);

export const authRouter = createAuthRouter(authController);
