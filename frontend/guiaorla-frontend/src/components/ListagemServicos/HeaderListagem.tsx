"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { MenuCategoriasMobile } from "./MenuCategoriasMobile";

interface HeaderProps {
  scrolled: boolean;
  categoriaAtiva: string;
  setCategoriaAtiva: (cat: string) => void;
  setIsFilterOpen: (open: boolean) => void;
  navRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => void;
  isEmpreendedor?: boolean;
  forceBlue?: boolean;
  showFilter?: boolean;
}

export const HeaderListagem = ({
  scrolled,
  categoriaAtiva,
  setCategoriaAtiva,
  setIsFilterOpen,
  navRef,
  handleMouseDown,
  isEmpreendedor = false,
  forceBlue = false,
  showFilter = true
}: HeaderProps) => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const bgColor = (isEmpreendedor && !forceBlue) ? 'bg-[#FF7620]' : 'bg-[#0A4F6E]';
  const categorias = ["Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"];

  useEffect(() => {
    const searchUrl = searchParams.get("search") || "";
    setTermoBusca(searchUrl);
  }, [searchParams]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const dispararBusca = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (termoBusca.trim()) {
      params.set("search", termoBusca.trim());
    } else {
      params.delete("search");
    }
    const baseRoute = isEmpreendedor ? "/empreendedor/explorer" : "/explorer";
    router.push(`${baseRoute}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") dispararBusca();
  };

  // Retorna o ID do Enum C# exato para cada categoria de string
  const obterIdPorTexto = (catTexto: string) => {
    const c = catTexto.toLowerCase();
    if (c.includes("artesanato")) return "0";
    if (c.includes("comércio") || c.includes("comercio") || c.includes("serviço")) return "1";
    if (c.includes("barraca") || c.includes("ambulante")) return "2";
    if (c.includes("passeio") || c.includes("lazer")) return "3";
    if (c.includes("bar") || c.includes("restaurante")) return "4";
    return "";
  };

  const handleCategoriaClick = (catTexto: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const idCatStr = obterIdPorTexto(catTexto);

    if (categoriaAtiva === idCatStr) {
      params.delete("categoria");
    } else {
      params.set("categoria", idCatStr);
    }

    const baseRoute = isEmpreendedor ? "/empreendedor/explorer" : "/explorer";
    router.push(`${baseRoute}?${params.toString()}`);
  };

  return (
    <header className={`${bgColor} w-full fixed top-0 z-50 shadow-md h-16 flex items-center px-4 transition-colors duration-300`}>
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3">

        {/* LADO ESQUERDO: Logo e Busca */}
        <div className="flex items-center gap-2 shrink-0 max-w-xs md:max-w-sm flex-1 lg:flex-none">
          {!isSearchOpen && (
            <Link href={isEmpreendedor ? "/empreendedor/explorer" : "/explorer"} className="shrink-0 w-20 sm:w-24">
              <Image src="/icons/LogoBranca.svg" alt="Logo" width={90} height={30} className="object-contain" />
            </Link>
          )}

          <div className="relative flex items-center flex-1">
            {isSearchOpen ? (
              <div className="flex items-center bg-white rounded-md h-9 w-full sm:w-[240px] md:w-[280px] animate-in fade-in zoom-in-95 duration-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar nome, praia, produto..."
                  className="flex-1 bg-transparent px-2 text-[11px] focus:outline-none text-[#0A4F6E]"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setTermoBusca("");
                    const baseRoute = isEmpreendedor ? "/empreendedor/explorer" : "/explorer";
                    router.push(baseRoute);
                  }}
                  className="pr-2 text-gray-400"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="hidden sm:flex items-center bg-white rounded-md shadow-sm h-9 overflow-hidden w-full min-w-[140px] max-w-[260px] transition-all duration-300">
                  <input
                    type="text"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nome, praia, produto..."
                    className="flex-1 bg-transparent px-3 h-full text-xs focus:outline-none text-[#0A4F6E] min-w-0"
                  />
                  <button
                    onClick={dispararBusca}
                    className="h-full px-2 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
                  >
                    <Search size={16} className="text-[#0A4F6E]" strokeWidth={2.5} />
                  </button>
                </div>

                <button
                  onClick={handleOpenSearch}
                  className="sm:hidden text-white p-1 flex items-center gap-1 group"
                >
                  <Search size={22} strokeWidth={2.5} />
                  <span className="text-[10px] font-medium opacity-70 group-hover:opacity-100">Buscar...</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/20 hidden lg:block"></div>

        {/* CATEGORIAS DESKTOP */}
        <nav
          ref={navRef}
          onMouseDown={handleMouseDown(navRef)}
          className={`hidden sm:flex flex-1 items-center overflow-x-auto scrollbar-hide flex-nowrap cursor-grab gap-3 ml-2 touch-pan-x ${isSearchOpen ? "sm:hidden md:flex" : ""}`}
        >
          {categorias.map((cat) => {
            // CORREÇÃO CRUCIAL: Mapeia o ID real baseado no texto para decidir a cor do botão ativo
            const idCategoriaStr = obterIdPorTexto(cat);
            return (
              <button
                key={cat}
                onClick={() => handleCategoriaClick(cat)}
                className={`rounded-full border border-white/20 font-bold whitespace-nowrap px-4 py-1.5 text-[10px] md:text-[11px] transition-all
                ${categoriaAtiva === idCategoriaStr ? "bg-white text-[#0A4F6E]" : "text-white hover:bg-white/20"}`}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        {/* AÇÕES DIREITA */}
        <div className={`flex items-center gap-2 sm:gap-4 pl-2 sm:pl-3 h-8 shrink-0 ${isEmpreendedor ? "border-l border-white/20" : ""}`}>
          <div className="sm:hidden">
            <MenuCategoriasMobile
              categorias={categorias}
              categoriaAtiva={categoriaAtiva}
              onSelect={(catTexto) => handleCategoriaClick(catTexto)}
            />
          </div>

          {showFilter && (
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden text-white text-[10px] sm:text-xs font-bold whitespace-nowrap hover:underline"
            >
              Filtros
            </button>
          )}

          {isEmpreendedor && (
            <div className="flex items-center gap-3">
              <Link href="/empreendedor/gerenciar" className="text-white text-[10px] md:text-xs font-semibold hover:underline whitespace-nowrap">Gerenciar</Link>
              <Link href="/empreendedor/meu-perfil" className="text-white text-[10px] md:text-xs font-semibold hover:underline whitespace-nowrap">Perfil</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};