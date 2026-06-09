// export { default } from "next-auth/middleware";

// export const config = {
//   matcher: [
//     "/empreendedor/gerenciar/:path*",
//     "/empreendedor/meu-perfil/:path*",
//   ],
// };

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/empreendedor/login-empreendedor",
  },
  // injeta a mesma chave exata que coloquei no route.ts
  secret: "guia-orla-pe-secret-key-temporary-123456789",
});

export const config = {
  matcher: [
    "/empreendedor/gerenciar/:path*",
    "/empreendedor/meu-perfil/:path*",
  ],
};