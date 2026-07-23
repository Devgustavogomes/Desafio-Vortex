import mongoose from 'mongoose';
import { env } from '@/infra/config/env';
import { logger } from '@/infra/logger/logger';

mongoose.connection.on('connected', () => {
  logger.info('✅ MongoDB conectado com sucesso');
});

mongoose.connection.on('error', (err: Error) => {
  logger.error({ err }, '❌ Erro na conexão MongoDB');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB desconectado');
});

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
}
