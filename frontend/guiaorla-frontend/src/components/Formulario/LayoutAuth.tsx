// "use client";
// import Image from "next/image";

// interface LayoutAuthProps {
//   children: React.ReactNode;
// }

// export const LayoutAuth = ({ children }: LayoutAuthProps) => {
//   return (
//     <main className="flex min-h-screen w-full bg-[#ECF9FF] overflow-hidden font-sans">
      
//       {/* LADO ESQUERDO: Imagem com a Curva (40%) */}
//       <div 
//         className="relative hidden lg:block w-[40%] h-screen overflow-hidden rounded-br-[500px] z-20"
//         style={{ filter: 'drop-shadow(4px 4px 100px rgba(117, 179, 198, 1))' }}
//       >
//         <Image
//           src="/images/fundopraia.jpg" 
//           alt="Praia de Pernambuco"
//           fill
//           className="object-cover object-top"
//           priority
//         />
//       </div>

//       {/* LADO DIREITO: Conteúdo (60%) */}
//       <div className="relative flex w-full flex-col items-center lg:w-[60%] px-8 pt-4 pb-10 overflow-y-auto justify-center">
//         <div className="flex w-full max-w-[450px] flex-col items-center gap-4">
//           {children}
//         </div>
//       </div>
//     </main>
//   );
// };


// src/components/Formulario/LayoutAuth.tsx
"use client";
import Image from "next/image";

export const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen w-full bg-[#ECF9FF] overflow-hidden font-sans">
      {/* ESQUERDA */}
      <div className="relative hidden lg:block w-[40%] h-full overflow-hidden rounded-br-[500px] z-20"
        style={{ filter: 'drop-shadow(4px 4px 100px rgba(117, 179, 198, 1))' }}>
        <Image src="/images/fundopraia.jpg" alt="Praia" fill className="object-cover object-top" priority />
      </div>

      {/* DIREITA - O segredo está no h-full e items-center sem o padding bottom exagerado */}
      <div className="relative flex w-full flex-col items-center lg:w-[60%] px-8 h-full justify-center overflow-hidden">
        <div className="flex w-full max-w-[450px] flex-col items-center">
          {children}
        </div>
      </div>
    </main>
  );
};