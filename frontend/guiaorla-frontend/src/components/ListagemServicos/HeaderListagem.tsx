"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Search, LogOut } from "lucide-react";
import { MenuCategoriasMobile } from "./MenuCategoriasMobile";
import { signOut } from "next-auth/react";

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

  // ESTADOS DO MODAL DE LOGOUT
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [naoPerguntarDeNovo, setNaoPerguntarDeNovo] = useState(false);

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

  const obterIdPorTexto = (catTexto: string) => {
    const c = catTexto.toLowerCase();
    if (c.includes("barraca") || c.includes("ambulante")) return "1";
    if (c.includes("passeio") || c.includes("lazer")) return "2";
    if (c.includes("bar") || c.includes("restaurante")) return "3";
    if (c.includes("artesanato")) return "4";
    if (c.includes("comércio") || c.includes("comercio") || c.includes("serviço")) return "5";
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

  // FUNÇÃO DE LOGOUT INTELIGENTE
  const handleSignOutClick = () => {
    const pularConfirmacao = localStorage.getItem("guiaorla_pular_confirmacao_logout");
    if (pularConfirmacao === "true") {
      // AJUSTADO: Redireciona para a rota raiz (Splash)
      signOut({ callbackUrl: "/" });
    } else {
      setIsLogoutModalOpen(true);
    }
  };

  const confirmarSignOut = () => {
    if (naoPerguntarDeNovo) {
      localStorage.setItem("guiaorla_pular_confirmacao_logout", "true");
    }
    // AJUSTADO: Redireciona para a rota raiz (Splash)
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
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
                className="text-white text-[10px] sm:text-xs font-bold whitespace-nowrap hover:underline"
              >
                Filtros
              </button>
            )}

            {isEmpreendedor && (
              <div className="flex items-center gap-3.5">
                <Link href="/empreendedor/gerenciar" className="text-white text-[10px] md:text-xs font-semibold hover:underline whitespace-nowrap">Gerenciar</Link>
                <Link href="/empreendedor/meu-perfil" className="text-white text-[10px] md:text-xs font-semibold hover:underline whitespace-nowrap">Perfil</Link>
                <button 
                  type="button"
                  onClick={handleSignOutClick}
                  className="text-white text-[10px] md:text-xs font-bold hover:text-red-200 transition-colors bg-transparent border-0 cursor-pointer whitespace-nowrap"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-600 mb-4">
              <LogOut size={22} />
            </div>
            
            <h3 className="text-base font-bold text-[#0A4F6E] mb-2">Deseja sair da conta?</h3>
            <p className="text-xs text-gray-500 mb-5">Você precisará digitar suas credenciais novamente para acessar o painel do seu quiosque.</p>

            {/* CHECKBOX NÃO PERGUNTAR NOVAMENTE */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={naoPerguntarDeNovo}
                  onChange={(e) => setNaoPerguntarDeNovo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF7620] focus:ring-[#FF7620]"
                />
                <span className="text-[11px] font-semibold text-gray-500">Não perguntar novamente</span>
              </label>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarSignOut}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};