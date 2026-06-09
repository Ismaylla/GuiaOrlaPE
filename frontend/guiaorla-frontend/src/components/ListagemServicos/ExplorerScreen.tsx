"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { FiltrosInterface } from "@/components/ListagemServicos/FiltrosInterface";
import { CardServico } from "@/components/ListagemServicos/CardServico";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { ModalVerMais } from "@/components/ListagemServicos/ModalVerMais";

// Importação das funções do novo arquivo de serviço
import { listarTodosOsNegocios, buscarNegociosComFiltros } from "@/services/businessService";

interface ExplorerScreenProps {
    isEmpreendedor: boolean;
}

export const ExplorerScreen = ({ isEmpreendedor }: ExplorerScreenProps) => {
    const searchParams = useSearchParams();
    const [categoriaAtiva, setCategoriaAtiva] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // ESTADOS DE INTEGRAÇÃO DA API
    const [listaNegocios, setListaNegocios] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroApi, setErroApi] = useState(false);

    const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);

    const navRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const temDados = listaNegocios.length > 0;

    const [filtros, setFiltros] = useState({
        localizacao: "",
        precoMinManual: "", 
        precoMaxManual: "", 
        faixaPreco: "", 
        cartao: true,
        chuveiro: false, 
        estacionamento: false, 
        cadeira: false, 
        petFriendly: false, 
        acessibilidade: false, 
        melhoresAvaliados: false
    });

    // Função centralizada para buscar os dados do C#
    const carregarNegocios = useCallback(async (filtrosAtuais = filtros, categoriaFiltro = categoriaAtiva) => {
        try {
            setCarregando(true);
            setErroApi(false);

            // Verifica se existe algum filtro de busca ativo ou categoria selecionada
            const temFiltroAtivo = 
                filtrosAtuais.localizacao || 
                filtrosAtuais.faixaPreco || 
                categoriaFiltro ||
                !filtrosAtuais.cartao || // Se desmarcar cartão, altera a busca
                filtrosAtuais.chuveiro || 
                filtrosAtuais.estacionamento ||
                filtrosAtuais.cadeira ||
                filtrosAtuais.petFriendly || 
                filtrosAtuais.acessibilidade ||
                filtrosAtuais.melhoresAvaliados;

            let dados;
            if (temFiltroAtivo) {
                // Passa os filtros, a categoria selecionada e o termo de busca (opcional) para o service
                dados = await buscarNegociosComFiltros(filtrosAtuais, categoriaFiltro);
                
                // Trata caso o método Search de paginação retorne um objeto envelopado (ex: { items: [...] })
                setListaNegocios(dados.items ? dados.items : dados);
            } else {
                // Rota limpa quando não há parâmetros
                dados = await listarTodosOsNegocios();
                setListaNegocios(dados);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do GuiaOrlaPE.API:", error);
            setErroApi(true);
        } finally {
            setCarregando(false);
        }
    }, [filtros, categoriaAtiva]);

    // Busca inicial quando a página carrega
    useEffect(() => {
        carregarNegocios();
    }, []);

    // Sincroniza a categoria vinda da URL/Header e refaz a busca automaticamente
    useEffect(() => {
        const catUrl = searchParams.get("categoria") || "";
        setCategoriaAtiva(catUrl);
        carregarNegocios(filtros, catUrl);
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (servicoSelecionado) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [servicoSelecionado]);

    const handleMouseDown = (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => {
        if (!ref.current || ref.current.scrollWidth <= ref.current.clientWidth) return;
        const ele = ref.current;
        const startX = e.pageX - ele.offsetLeft;
        const scrollLeft = ele.scrollLeft;
        const handleMouseMove = (le: MouseEvent) => {
            const x = le.pageX - ele.offsetLeft;
            const walk = (x - startX) * 2;
            ele.scrollLeft = scrollLeft - walk;
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const moveDistance = clientWidth * 0.8;
            const scrollTo = direction === "left" ? scrollLeft - moveDistance : scrollLeft + moveDistance;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f6f6] font-sans pb-20">
            <HeaderListagem
                scrolled={scrolled}
                categoriaAtiva={categoriaAtiva}
                setCategoriaAtiva={setCategoriaAtiva}
                setIsFilterOpen={setIsFilterOpen}
                navRef={navRef}
                handleMouseDown={handleMouseDown}
                isEmpreendedor={isEmpreendedor}
                forceBlue={true}
            />

            <div className="h-16 md:h-20"></div>

            {servicoSelecionado && (
                <ModalVerMais 
                    item={servicoSelecionado}
                    isEmpreendedor={isEmpreendedor}
                    onClose={() => setServicoSelecionado(null)} 
                />
            )}

            {/* MODAL DE FILTROS MOBILE */}
            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsFilterOpen(false)}></div>
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 shadow-2xl transition-all duration-300 ${isFilterOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-[#0A4F6E] font-bold text-lg mb-4">Filtros</h3>
                    <FiltrosInterface filtros={filtros} setFiltros={setFiltros} contexto="modal" />
                    <button 
                        onClick={() => { setIsFilterOpen(false); carregarNegocios(); }} 
                        className="w-full mt-6 py-3.5 bg-[#0A4F6E] text-white rounded-2xl font-bold"
                    >
                        Aplicar filtros
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 mt-4 md:mt-6 relative">
                <aside className="hidden md:flex flex-col gap-2 sticky top-[104px] h-fit self-start">
                    <div className="w-full h-28 rounded-xl overflow-hidden relative border border-gray-200 shadow-sm group">
                        <Image src="/images/map-placeholder.png" alt="Mapa" fill className="object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-[#0A4F6E]/10 flex items-center justify-center">
                            <button className="bg-white/90 text-[#0A4F6E] px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md hover:bg-white transition-all">Ver no mapa</button>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-[#0A4F6E] font-bold text-[11px] mb-2 border-b pb-1 uppercase tracking-tighter">Refinar busca</h3>
                        <FiltrosInterface filtros={filtros} setFiltros={setFiltros} contexto="aside" />
                        <button 
                            onClick={() => carregarNegocios()}
                            className="w-full mt-3 py-2 bg-[#0A4F6E] text-white rounded-lg font-bold hover:bg-[#083d55] transition-colors shadow-sm text-[11px]"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </aside>

                {/* CONTEÚDO PRINCIPAL CONTROLADO PELO ESTADO DA API */}
                <div className="min-w-0">
                    {carregando ? (
                        <div className="text-center p-20 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-[#0A4F6E] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 text-xs italic font-medium">Carregando estabelecimentos da orla...</p>
                        </div>
                    ) : erroApi ? (
                        <div className="text-center p-12 bg-red-50 rounded-2xl border border-dashed border-red-200">
                            <p className="text-red-600 font-bold text-sm">Não foi possível conectar ao servidor local.</p>
                            <p className="text-gray-500 text-xs mt-1">Verifique se a sua API C# está rodando perfeitamente na porta 5148.</p>
                        </div>
                    ) : (
                        <>
                            <section className="mb-12 md:mb-16">
                                <h2 className="text-[#0A4F6E] text-lg md:text-xl font-bold italic mb-4 md:mb-6 text-center md:text-left tracking-tight">Próximos de você</h2>
                                {temDados ? (
                                    <div className="relative flex items-start pt-2 px-0 md:px-10">
                                        <button onClick={() => scroll("left")} className="absolute left-0 top-[40%] -translate-y-1/2 z-20 hover:scale-110 transition-transform hidden md:block">
                                            <Image src="/icons/SetaAzul.svg" width={28} height={28} alt="ant" />
                                        </button>
                                        <div ref={scrollRef} onMouseDown={handleMouseDown(scrollRef)}
                                            className="flex overflow-x-auto gap-4 md:gap-5 w-full pb-6 scrollbar-hide snap-x items-start cursor-grab active:cursor-grabbing"
                                        >
                                            {listaNegocios.map((item) => (
                                                <CardServico 
                                                    key={item.id} 
                                                    item={item} 
                                                    variante="vertical" 
                                                    isEmpreendedor={isEmpreendedor} 
                                                    onOpenModal={(item) => setServicoSelecionado(item)}
                                                />
                                            ))}
                                        </div>
                                        <button onClick={() => scroll("right")} className="absolute right-0 top-[40%] -translate-y-1/2 z-20 hover:scale-110 transition-transform rotate-180 hidden md:block">
                                            <Image src="/icons/SetaAzul.svg" width={28} height={28} alt="prox" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center p-10 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 text-sm italic">Nenhum serviço encontrado para os critérios selecionados.</p>
                                    </div>
                                )}
                            </section>

                            <hr className="w-full border-gray-200 mb-10 md:mb-12" />

                            <section>
                                <h2 className="text-[#0A4F6E] text-lg md:text-xl font-bold mb-6 md:mb-8 italic text-center md:text-left tracking-tight">Todos os estabelecimentos</h2>
                                {temDados ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                                        {listaNegocios.map((item) => (
                                            <CardServico 
                                                key={item.id} 
                                                item={item} 
                                                variante="horizontal" 
                                                isEmpreendedor={isEmpreendedor} 
                                                onOpenModal={(item) => setServicoSelecionado(item)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-10 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 text-sm italic">Não há estabelecimentos cadastrados no momento.</p>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};