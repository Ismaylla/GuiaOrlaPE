"use client";
import Image from "next/image";

export const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen w-full bg-[#ECF9FF] font-sans">
      {/* ESQUERDA */}
      <div
        className="relative hidden lg:block w-[40%] h-screen sticky top-0 overflow-hidden rounded-br-[500px] z-20"
        style={{ filter: "drop-shadow(4px 4px 100px rgba(117, 179, 198, 1))" }}
      >
        <Image
          src="/images/fundopraia.jpg"
          alt="Praia"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* DIREITA - pt-16 dá um respiro do topo sem centralizar forçado */}
      <div className="relative flex w-full flex-col items-center lg:w-[60%] px-6 pt-16 pb-10 overflow-y-auto min-h-screen">
        <div className="flex w-full max-w-[450px] flex-col items-center">
          {children}
        </div>
      </div>
    </main>
  );
};