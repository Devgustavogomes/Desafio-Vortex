import Redis from 'ioredis';
import { env } from '@/infra/config/env';
import { logger } from '@/infra/logger/logger';

export const redisClient = new Redis(env.REDIS_URL);

redisClient.on('connect', () => {
  logger.info('✅ Redis conectado com sucesso');
});

redisClient.on('error', (err: Error) => {
  logger.error({ err }, '❌ Erro na conexão Redis');
});

redisClient.on('close', () => {
  logger.warn('⚠️ Conexão Redis fechada');
});


