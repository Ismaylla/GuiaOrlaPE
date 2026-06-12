import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/auth.service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials) return null;

          // CORRIGIDO: Forçamos o 'as any' aqui para o TypeScript aceitar a resposta da API do C#
          const data = await login({
            email: credentials.email,
            password: credentials.password,
          }) as any;

          // Alinhando o mapeamento com os nomes reais do seu backend C#
          const userId = data?.user?.id || "mock-id";
          const userName = data?.user?.name || "Usuário";
          const userEmail = data?.email || credentials.email;
          
          // Captura 'accessToken' (do C#) e aceita 'token' apenas como segunda opção
          const userToken = data?.accessToken || data?.token || "mock-token";
          const userPerfil = data?.user?.profile || "BUSINESS_OWNER";

          return {
            id: String(userId),
            name: userName,
            email: userEmail,
            perfil: userPerfil,
            token: userToken, // Esse cara vai ser repassado para o token.accessToken abaixo
          } as any;
        } catch (error) {
          console.error("Erro na autorização do NextAuth:", error);
          return null;
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.perfil = user.perfil;
        token.accessToken = user.token; // Pega o userToken correto lá de cima
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.perfil = token.perfil;
        session.accessToken = token.accessToken; // Torna o token real visível no useSession()
      }
      return session;
    },
  },

  pages: {
    signIn: "/empreendedor/login-empreendedor",
  },

  secret: "guia-orla-pe-secret-key-temporary-123456789",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };