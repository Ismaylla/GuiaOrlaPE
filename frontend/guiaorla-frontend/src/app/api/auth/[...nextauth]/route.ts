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

          const data = await login({
            email: credentials.email,
            password: credentials.password,
          });

          const userId = data?.user?.id || "mock-id";
          const userName = data?.user?.name || "Usuário";
          const userEmail = data?.email || credentials.email;
          const userToken = data?.token || "mock-token";
          const userPerfil = data?.user?.profile || "BUSINESS_OWNER";

          return {
            id: String(userId),
            name: userName,
            email: userEmail,
            perfil: userPerfil,
            token: userToken,
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
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.perfil = token.perfil;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/empreendedor/login-empreendedor",
  },

  // Forçamos uma string fixa diretamente aqui. Se o arquivo .env estiver ausente,
  // essa string garante que o NextAuth monte o servidor sem dar erro de configuração.
  secret: "guia-orla-pe-secret-key-temporary-123456789",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };