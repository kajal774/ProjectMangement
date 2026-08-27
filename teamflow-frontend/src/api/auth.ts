import { apiClient } from "./apiClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

// Each function here maps to exactly one backend endpoint. No hidden
// logic, no clever wrapping — if you know the endpoint, you know what
// this function does.

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
}
