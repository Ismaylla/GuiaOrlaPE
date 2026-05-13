
import { BusinesspersonResponse, CreateBusinesspersonRequest } from "@/interfaces/businessPersonRequest";
import { api } from "./api";


export async function registerBusinessperson(
  data: CreateBusinesspersonRequest
): Promise<BusinesspersonResponse> {
  

   try {
    const response = await api.post<BusinesspersonResponse>(
    "/users/businessperson",
    data
  );

  return response.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);

    throw error;
  }
}