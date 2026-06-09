import { api } from "./api";

// Mantendo o tipo LoginRequest que você já usa
export async function login(data: any) {
  try {
    // 1. Aponta para a rota real que criamos no UserController.cs
    const response = await api.post("/api/users/login", data);

    // 2. Transforma o retorno no formato exato que o seu NextAuth espera receber no authorize()
    return {
      user: {
        id: response.data.id,
        name: response.data.name,
        profile: "BUSINESS_OWNER" // Perfil apenas para preencher a propriedade
      },
      email: response.data.email,
      token: "mock-jwt-token" // Token temporário para manter o NextAuth logado
    };
  } catch (error) {
    console.error("Erro ao realizar login no auth.service:", error);
    throw error;
  }
}