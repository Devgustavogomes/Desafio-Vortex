import { api } from "./api";
import { storage } from "../utils/storage";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth.types";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const { data: responseData } = await api.post<AuthResponse>("/auth/login", data);
  storage.setAccessToken(responseData.accessToken);
  return responseData;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const { data: responseData } = await api.post<AuthResponse>("/auth/register", data);
  storage.setAccessToken(responseData.accessToken);
  return responseData;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  storage.clearAccessToken();
}
