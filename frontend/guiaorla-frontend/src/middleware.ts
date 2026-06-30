import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/empreendedor/login-empreendedor",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: [
    "/empreendedor/gerenciar/:path*",
    "/empreendedor/meu-perfil/:path*",
  ],
};