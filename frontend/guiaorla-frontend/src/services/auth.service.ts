import { api } from "./api";

export async function login(data: any) {
  try {
    // 1. Aponta para a rota real no seu C#
    const response = await api.post("/api/users/login", data);
    console.log("🔍 O QUE O C# DEVOLVEU NO LOGIN:", response.data);

    // 2. CORRIGIDO: Repassa o token real criptografado (eyJ...) vindo do C#
    return {
      user: {
        id: response.data.id,
        name: response.data.name,
        profile: "BUSINESS_OWNER"
      },
      email: response.data.email,
      token: response.data.accessToken,       // NextAuth vai ler aqui
      accessToken: response.data.accessToken // Garantia extra para o authorize
    };
  } catch (error) {
    console.error("Erro ao realizar login no auth.service:", error);
    throw error;
  }
}