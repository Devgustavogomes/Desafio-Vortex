import { api } from "./api";
import type { User } from "../types/auth.types";

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>("/users");
  return data;
}
