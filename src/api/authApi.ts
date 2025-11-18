import { api } from "./http";
import type { User } from "../store/authStore";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterRequest {
  email: string;
  password: string;
}

export const AuthApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/auth/login", payload);
    return res.data;
  },
  async register(payload: RegisterRequest): Promise<void> {
    await api.post("/auth/register", payload);
  },
};
