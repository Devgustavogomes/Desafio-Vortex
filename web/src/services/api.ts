import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { storage } from "../utils/storage";

// ─── Instância Axios ─────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Envia cookies (refreshToken httpOnly) automaticamente
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Injeta o header Authorization em todas as requests quando há access token

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Refresh Queue (mutex) ───────────────────────────────────────────────────
// Garante que múltiplos 401 simultâneos não disparem múltiplos refreshes.
// A primeira request que detecta 401 executa o refresh; as demais ficam
// enfileiradas e são resolvidas/rejeitadas em lote após o refresh terminar.

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

// ─── Response Interceptor (401 → Refresh Transparente) ───────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
    const alreadyRetried = originalRequest?._retry;

    // Não tenta refresh se:
    // - Não é um erro 401
    // - A request que falhou já é o próprio refresh (evita loop infinito)
    // - Já foi feito um retry nesta request
    if (!isUnauthorized || isRefreshRequest || alreadyRetried) {
      return Promise.reject(error);
    }

    // Se já há um refresh em andamento, enfileira esta request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    // Primeira request a detectar 401 → inicia o refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Usamos axios diretamente (não a instância api) para evitar que o
      // request interceptor injete o token expirado e crie um loop.
      const { data } = await axios.post<{ accessToken: string }>(
        "http://localhost:3000/auth/refresh",
        {},
        { withCredentials: true }
      );

      const newToken = data.accessToken;
      storage.setAccessToken(newToken);
      processQueue(null, newToken);

      // Re-executa a request original com o novo token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      storage.clearAccessToken();

      // Redireciona para /login (quando React Router for adicionado,
      // refatorar para usar navigate())
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { api };
