// import { api } from "./api";

// export async function login(data: any) {
//   try {
//     // 1. Aponta para a rota real no seu C#
//     const response = await api.post("/api/users/login", data);

//     // 2. CORRIGIDO: Repassa o token real criptografado (eyJ...) vindo do C#
//     return {
//       user: {
//         id: response.data.id,
//         name: response.data.name,
//         profile: "BUSINESS_OWNER"
//       },
//       email: response.data.email,
//       token: response.data.accessToken,       // NextAuth vai ler aqui
//       accessToken: response.data.accessToken // Garantia extra para o authorize
//     };
//   } catch (error) {
//     console.error("Erro ao realizar login no auth.service:", error);
//     throw error;
//   }
// }

// export const forgotPassword = async (email: string) => {
//   const { data } = await api.post('/api/auth/forgot-password', { email });
//   return data;


// };


import { api } from "./api";

export async function login(data: any) {
  try {
    // 1. Aponta para a rota real no seu C#
    const response = await api.post("/api/users/login", data);

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

export const forgotPassword = async (email: string) => {
  const { data } = await api.post('/api/auth/forgot-password', { email });
  return data;
}; // <--- Faltava essa chave aqui para fechar o forgotPassword!

export const updateEmail = async (userId: string, newEmail: string) => {
  const { data } = await api.put(`/api/users/${userId}/update-email`, { newEmail });
  return data;
};

export const changePassword = async (userId: string, data: { currentPassword: string; newPassword: string }) => {
  const response = await api.put(`/api/users/${userId}/change-password`, data);
  return response.data;
};

export const deleteAccount = async (userId: string) => {
  const response = await api.delete(`/api/users/${userId}`);
  return response.data;
};