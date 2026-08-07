import { MongoAuthRepository } from './infra/repositories/MongoAuthRepository';
import { RedisRefreshTokenRepository } from './infra/repositories/RedisRefreshTokenRepository';
import { TokenService } from './application/services/TokenService';
import { RegisterUseCase } from './application/useCases/RegisterUseCase';
import { LoginUseCase } from './application/useCases/LoginUseCase';
import { RefreshTokenUseCase } from './application/useCases/RefreshTokenUseCase';
import { LogoutUseCase } from './application/useCases/LogoutUseCase';
import { AuthController } from './presentation/controllers/AuthController';
import { createAuthRouter } from './presentation/routes/authRoutes';

const tokenService = new TokenService();
const refreshTokenRepository = new RedisRefreshTokenRepository();
const authRepository = new MongoAuthRepository();

const registerUseCase = new RegisterUseCase(authRepository, refreshTokenRepository, tokenService);
const loginUseCase = new LoginUseCase(authRepository, refreshTokenRepository, tokenService);
const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, tokenService);
const logoutUseCase = new LogoutUseCase(refreshTokenRepository, tokenService);

const authController = new AuthController(registerUseCase, loginUseCase, refreshTokenUseCase, logoutUseCase);

export const authRouter = createAuthRouter(authController);
