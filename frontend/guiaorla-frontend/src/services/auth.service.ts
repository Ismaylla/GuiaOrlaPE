import axios from 'axios';

// Detecta se estamos no servidor (Docker) ou no navegador
const API_URL = typeof window === 'undefined' 
  ? process.env.API_URL_INTERNAL || 'http://backend:8080' 
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Criamos uma instância dinâmica baseada no ambiente
const apiClient = axios.create({
  baseURL: API_URL
});

export async function login(data: any) {
  try {
    const response = await apiClient.post("/api/auth/login", data);
    return {
      user: {
        id: response.data.user.id,
        name: response.data.user.name,
        profile: response.data.user.profile
      },
      email: response.data.user.email,
      token: response.data.accessToken,
      accessToken: response.data.accessToken
    };
  } catch (error) {
    console.error("Erro ao realizar login no auth.service:", error);
    throw error;
  }
}

export const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post('/api/auth/forgot-password', { email });
  return data;
};

export const updateEmail = async (userId: string, newEmail: string) => {
  const { data } = await apiClient.put(`/api/users/${userId}/update-email`, { newEmail });
  return data;
};

export const changePassword = async (userId: string, data: { currentPassword: string; newPassword: string }) => {
  const response = await apiClient.put(`/api/users/${userId}/change-password`, data);
  return response.data;
};

export const deleteAccount = async (userId: string) => {
  const response = await apiClient.delete(`/api/users/${userId}`);
  return response.data;
};