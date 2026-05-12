import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/auth.service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }

          const data = await login({
            email: credentials.email,
            password: credentials.password,
          });

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.email,
            perfil: data.user.profile,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Erro na autorização:", error);

          return null;
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/empreendedor/login-empreendedor",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 