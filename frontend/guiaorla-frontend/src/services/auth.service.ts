import { api } from "./api";

export async function login(data: LoginRequest) {
  try {
    const response = await api.post("/auth/login", data);

    return response.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);

    throw error;
  }
}