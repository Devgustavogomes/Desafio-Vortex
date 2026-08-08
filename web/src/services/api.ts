import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { storage } from "../utils/storage";



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, 
});




api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});






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



api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
    const alreadyRetried = originalRequest?._retry;

    
    
    
    
    if (!isUnauthorized || isRefreshRequest || alreadyRetried) {
      return Promise.reject(error);
    }

    
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      
      
      const { data } = await axios.post<{ accessToken: string }>(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = data.accessToken;
      storage.setAccessToken(newToken);
      processQueue(null, newToken);

      
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      storage.clearAccessToken();

      
      
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { api };
