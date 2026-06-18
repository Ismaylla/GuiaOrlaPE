import { BusinesspersonResponse, CreateBusinesspersonRequest } from "@/interfaces/businessPersonRequest";
import { api } from "./api";

export async function registerBusinessperson(
  data: CreateBusinesspersonRequest
): Promise<BusinesspersonResponse> {
  try {
    // APENAS ADICIONAMOS O /api NA FRENTE DA ROTA
    const response = await api.post<BusinesspersonResponse>(
      "/api/users/businessperson",
      data
    );

    return response.data;
  } catch (error) {
    // Corrigido o texto do log para fazer sentido com a ação de cadastro
    console.error("Erro ao realizar cadastro do empreendedor:", error);
    throw error;
  }
}