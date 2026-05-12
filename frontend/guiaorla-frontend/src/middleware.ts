export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/empreendedor/gerenciar/:path*",
    "/empreendedor/meu-perfil/:path*",
  ],
};