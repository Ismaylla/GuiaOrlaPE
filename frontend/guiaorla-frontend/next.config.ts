// Permite que o <Image> do Next carregue as fotos servidas pela API.
// O host é derivado de NEXT_PUBLIC_API_URL (definido no build), então funciona
// tanto em localhost quanto no endereço do CasaOS sem editar este arquivo.
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5148";
const { protocol, hostname, port } = new URL(apiUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port: port || "",
        pathname: "/uploads/**",
      },
    ],
  },
};
export default nextConfig;
