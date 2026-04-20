// src/components/ListagemServicos/HeaderListagem.tsx
"use client";
import Image from "next/image";

interface HeaderProps {
    scrolled: boolean;
    categoriaAtiva: string;
    setCategoriaAtiva: (cat: string) => void;
    setIsFilterOpen: (open: boolean) => void;
    navRef: React.RefObject<HTMLDivElement | null>;
    handleMouseDown: (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => void;
}

export const HeaderListagem = ({ 
    scrolled, 
    categoriaAtiva, 
    setCategoriaAtiva, 
    setIsFilterOpen, 
    navRef, 
    handleMouseDown 
}: HeaderProps) => {
    return (
        <header className={`bg-[#0A4F6E] w-full fixed top-0 z-50 transition-all duration-500 shadow-md flex flex-col justify-center ${scrolled ? "h-auto py-2 md:h-16" : "h-24"}`}>
            <div className="w-full flex items-center justify-between px-4 md:px-10 gap-2">
                <div className={`transition-all duration-500 shrink-0 ${scrolled ? "opacity-100 translate-x-0 w-24 md:w-32 hidden md:block" : "opacity-0 -translate-x-10 w-0 overflow-hidden"}`}>
                    <Image src="/icons/LogoBranca.svg" alt="Logo" width={100} height={100} className="object-contain" />
                </div>
                <nav ref={navRef} onMouseDown={handleMouseDown(navRef)}
                    className={`flex transition-all duration-500 flex-1 items-center overflow-x-auto scrollbar-hide flex-nowrap cursor-grab active:cursor-grabbing gap-3 px-2 justify-start mx-auto`}
                    style={{ maxWidth: 'fit-content' }}
                >
                    {[
                        { name: "Barracas e Ambulantes", icon: "🏖️" },
                        { name: "Passeios e Lazer", icon: "🚤" },
                        { name: "Bares e Restaurantes", icon: "🍽️" },
                        { name: "Artesanato Local", icon: "🎨" },
                        { name: "Comércio e Serviços", icon: "🛒" }
                    ].map((cat) => (
                        <button key={cat.name} onClick={() => setCategoriaAtiva(cat.name)}
                            className={`rounded-full border-2 border-white font-bold transition-all duration-300 whitespace-nowrap shrink-0 select-none
                            ${scrolled ? "px-5 py-2 text-[11px] md:text-sm" : "px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-[13px]"}
                            ${categoriaAtiva === cat.name ? "bg-white text-[#0A4F6E]" : "text-white hover:bg-white/10"}`}
                        > {cat.icon} {cat.name} </button>
                    ))}
                </nav>
                <div className={`items-center gap-4 transition-all duration-500 shrink-0 hidden md:flex ${scrolled ? "opacity-100 ml-4" : "opacity-0 w-0 overflow-hidden"}`}>
                    <input type="text" placeholder="Buscar..." className="h-8 w-32 md:w-40 lg:w-72 px-3 rounded-lg bg-white border border-gray-300 text-[#0A4F6E] text-[10px] focus:outline-none" />
                    <Image src="/icons/Perfil.svg" alt="Perfil" width={32} height={32} className="shrink-0 cursor-pointer" />
                </div>
            </div>
            {/* MOBILE SEARCH & FILTERS */}
            <div className={`md:hidden flex items-center gap-2 px-4 py-2 transition-all duration-500 ${scrolled ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"}`}>
                <button className="bg-white/10 text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/20 whitespace-nowrap">📍 MAPA</button>
                <button onClick={() => setIsFilterOpen(true)} className="bg-[#FF7620] text-white px-2 py-1.5 rounded-lg text-[9px] font-bold whitespace-nowrap shadow-sm">⚙️ FILTROS</button>
                <input type="text" placeholder="Buscar..." className="flex-1 h-8 px-2 rounded-lg bg-white border border-gray-300 text-[10px] outline-none text-[#0A4F6E]" />
                <Image src="/icons/Perfil.svg" alt="Perfil" width={28} height={28} className="shrink-0" />
            </div>
        </header>
    );
};
