
// "use client";
// import Image from "next/image";

// interface HeaderProps {
//   scrolled: boolean;
//   categoriaAtiva: string;
//   setCategoriaAtiva: (cat: string) => void;
//   setIsFilterOpen: (open: boolean) => void;
//   navRef: React.RefObject<HTMLDivElement | null>;
//   handleMouseDown: (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => void;
//   isEmpreendedor?: boolean;
// }

// export const HeaderListagem = ({ 
//   scrolled, categoriaAtiva, setCategoriaAtiva, setIsFilterOpen, navRef, handleMouseDown, isEmpreendedor = false 
// }: HeaderProps) => {
  
//   const bgColor = isEmpreendedor ? 'bg-[#FF7620]' : 'bg-[#0A4F6E]';

//   return (
//     <header className={`${bgColor} w-full fixed top-0 z-50 shadow-md h-16 flex items-center px-4`}>
//       <div className="max-w-7xl w-full mx-auto flex items-center gap-3">
        
//         {/* LOGO */}
//         <div className="shrink-0 w-24">
//           <Image src="/icons/LogoBranca.svg" alt="Logo" width={90} height={30} className="object-contain" />
//         </div>

//         {/* BUSCA (Ajustada: mais larga, sem fundo no botão, ícone azul) */}
//         <div className="relative">
//           <div className="hidden md:flex items-center bg-white rounded-md shadow-sm h-10 overflow-hidden max-w-xl w-[320px]">
//             <input 
//               type="text" 
//               placeholder="Onde vamos hoje?" 
//               className="flex-1 bg-transparent px-4 h-full text-sm focus:outline-none text-[#0A4F6E]"
//             />
//             <button className="h-full px-3 flex items-center justify-center hover:bg-gray-50 transition-colors">
//                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A4F6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="11" cy="11" r="8"></circle>
//                   <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                </svg>
//             </button>
//           </div>
          
//           {/* Mobile: Ícone */}
//           <div className="md:hidden text-white cursor-pointer p-1">
//              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8"></circle>
//                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//              </svg>
//           </div>
//         </div>

//         {/* LINHA DIVISÓRIA (Busca -> Categorias) */}
//         <div className="h-8 w-[1px] bg-white/20 hidden md:block"></div>

//         {/* CATEGORIAS */}
//         <nav 
//           ref={navRef} 
//           onMouseDown={handleMouseDown(navRef)}
//           className="flex-1 flex items-center overflow-x-auto scrollbar-hide flex-nowrap cursor-grab gap-3 ml-2"
//         >
//           {["Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"].map((cat) => (
//             <button 
//               key={cat} 
//               onClick={() => setCategoriaAtiva(cat)}
//               className={`rounded-full border border-white/20 font-bold whitespace-nowrap px-4 py-1.5 text-[11px] transition-all
//               ${categoriaAtiva === cat ? "bg-white text-[#0A4F6E]" : "text-white hover:bg-white/20"}`}
//             > 
//               {cat} 
//             </button>
//           ))}
//         </nav>

//         {/* AÇÕES */}
//         <div className="flex items-center gap-3 pl-3 border-l border-white/20 h-8 shrink-0">
//             <button 
//               onClick={() => setIsFilterOpen(true)}
//               className="md:hidden text-white text-xs font-bold whitespace-nowrap hover:underline"
//             >
//               Filtros
//             </button>
//             <button className="text-white text-xs font-semibold hover:underline whitespace-nowrap">
//               Ver Perfil
//             </button>
//         </div>
//       </div>
//     </header>
//   );
// // };



// "use client";
// import Image from "next/image";

// interface HeaderProps {
//   scrolled: boolean;
//   categoriaAtiva: string;
//   setCategoriaAtiva: (cat: string) => void;
//   setIsFilterOpen: (open: boolean) => void;
//   navRef: React.RefObject<HTMLDivElement | null>;
//   handleMouseDown: (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => void;
//   isEmpreendedor?: boolean;
// }

// export const HeaderListagem = ({ 
//   scrolled, categoriaAtiva, setCategoriaAtiva, setIsFilterOpen, navRef, handleMouseDown, isEmpreendedor = false 
// }: HeaderProps) => {
  
//   const bgColor = isEmpreendedor ? 'bg-[#FF7620]' : 'bg-[#0A4F6E]';

//   return (
//     <header className={`${bgColor} w-full fixed top-0 z-50 shadow-md h-16 flex items-center px-4`}>
//       <div className="max-w-7xl w-full mx-auto flex items-center gap-3">
        
//         {/* LOGO */}
//         <div className="shrink-0 w-24">
//           <Image src="/icons/LogoBranca.svg" alt="Logo" width={90} height={30} className="object-contain" />
//         </div>

//         {/* BUSCA */}
//         <div className="relative">
//           <div className="hidden md:flex items-center bg-white rounded-md shadow-sm h-10 overflow-hidden max-w-xl w-[320px]">
//             <input 
//               type="text" 
//               placeholder="Onde vamos hoje?" 
//               className="flex-1 bg-transparent px-4 h-full text-sm focus:outline-none text-[#0A4F6E]"
//             />
//             <button className="h-full px-3 flex items-center justify-center hover:bg-gray-50 transition-colors">
//                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A4F6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="11" cy="11" r="8"></circle>
//                   <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                </svg>
//             </button>
//           </div>
          
//           {/* Mobile: Ícone */}
//           <div className="md:hidden text-white cursor-pointer p-1">
//              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8"></circle>
//                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//              </svg>
//           </div>
//         </div>

//         {/* LINHA DIVISÓRIA */}
//         <div className="h-8 w-[1px] bg-white/20 hidden md:block"></div>

//         {/* CATEGORIAS */}
//         <nav 
//           ref={navRef} 
//           onMouseDown={handleMouseDown(navRef)}
//           className="flex-1 flex items-center overflow-x-auto scrollbar-hide flex-nowrap cursor-grab gap-3 ml-2"
//         >
//           {["Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"].map((cat) => (
//             <button 
//               key={cat} 
//               onClick={() => setCategoriaAtiva(cat)}
//               className={`rounded-full border border-white/20 font-bold whitespace-nowrap px-4 py-1.5 text-[11px] transition-all
//               ${categoriaAtiva === cat ? "bg-white text-[#0A4F6E]" : "text-white hover:bg-white/20"}`}
//             > 
//               {cat} 
//             </button>
//           ))}
//         </nav>

//         {/* AÇÕES */}
//         <div className="flex items-center gap-3 pl-3 border-l border-white/20 h-8 shrink-0">
//             <button 
//               onClick={() => setIsFilterOpen(true)}
//               className="md:hidden text-white text-xs font-bold whitespace-nowrap hover:underline"
//             >
//               Filtros
//             </button>

//             {/* Novo Botão para Empreendedor */}
//             {isEmpreendedor && (
//               <button className="text-white text-xs font-semibold hover:underline whitespace-nowrap">
//                 Gerenciar
//               </button>
//             )}

//             <button className="text-white text-xs font-semibold hover:underline whitespace-nowrap">
//               Ver Perfil
//             </button>
//         </div>
//       </div>
//     </header>
//   );
// };


"use client";
import Image from "next/image";

interface HeaderProps {
  scrolled: boolean;
  categoriaAtiva: string;
  setCategoriaAtiva: (cat: string) => void;
  setIsFilterOpen: (open: boolean) => void;
  navRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => void;
  isEmpreendedor?: boolean;
  forceBlue?: boolean; // Adicionado para forçar azul no header do empreendedor
}

export const HeaderListagem = ({ 
  scrolled, categoriaAtiva, setCategoriaAtiva, setIsFilterOpen, navRef, handleMouseDown, isEmpreendedor = false, forceBlue = false 
}: HeaderProps) => {
  
  // Se for empreendedor E não for forçado azul, fica laranja. Caso contrário, azul.
  const bgColor = (isEmpreendedor && !forceBlue) ? 'bg-[#FF7620]' : 'bg-[#0A4F6E]';

  return (
    <header className={`${bgColor} w-full fixed top-0 z-50 shadow-md h-16 flex items-center px-4`}>
      <div className="max-w-7xl w-full mx-auto flex items-center gap-3">
        
        {/* LOGO */}
        <div className="shrink-0 w-24">
          <Image src="/icons/LogoBranca.svg" alt="Logo" width={90} height={30} className="object-contain" />
        </div>

        {/* BUSCA */}
        <div className="relative">
          <div className="hidden md:flex items-center bg-white rounded-md shadow-sm h-10 overflow-hidden max-w-xl w-[320px]">
            <input 
              type="text" 
              placeholder="Onde vamos hoje?" 
              className="flex-1 bg-transparent px-4 h-full text-sm focus:outline-none text-[#0A4F6E]"
            />
            <button className="h-full px-3 flex items-center justify-center hover:bg-gray-50 transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A4F6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
               </svg>
            </button>
          </div>
          
          {/* Mobile: Ícone */}
          <div className="md:hidden text-white cursor-pointer p-1">
             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
             </svg>
          </div>
        </div>

        {/* LINHA DIVISÓRIA */}
        <div className="h-8 w-[1px] bg-white/20 hidden md:block"></div>

        {/* CATEGORIAS */}
        <nav 
          ref={navRef} 
          onMouseDown={handleMouseDown(navRef)}
          className="flex-1 flex items-center overflow-x-auto scrollbar-hide flex-nowrap cursor-grab gap-3 ml-2"
        >
          {["Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategoriaAtiva(cat)}
              className={`rounded-full border border-white/20 font-bold whitespace-nowrap px-4 py-1.5 text-[11px] transition-all
              ${categoriaAtiva === cat ? "bg-white text-[#0A4F6E]" : "text-white hover:bg-white/20"}`}
            > 
              {cat} 
            </button>
          ))}
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/20 h-8 shrink-0">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden text-white text-xs font-bold whitespace-nowrap hover:underline"
            >
              Filtros
            </button>

            {/* Novo Botão Gerenciar (Apenas para empreendedores) */}
            {isEmpreendedor && (
              <button className="text-white text-xs font-semibold hover:underline whitespace-nowrap">
                Gerenciar
              </button>
            )}

            <button className="text-white text-xs font-semibold hover:underline whitespace-nowrap">
              Ver Perfil
            </button>
        </div>
      </div>
    </header>
  );
};