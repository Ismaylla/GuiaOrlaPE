
import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Importa a Poppins
import "./globals.css";

// Configura a fonte Poppins com os pesos que você usa no Figma
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GuiaOrlaPE",
  description: "Onde a orla encontra você",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}