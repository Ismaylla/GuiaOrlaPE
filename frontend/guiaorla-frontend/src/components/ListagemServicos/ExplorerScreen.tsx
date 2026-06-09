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

    // FUNÇÃO CENTRAL: Faz mapeamento e filtro local dinâmico baseado na resposta real do banco
    const carregarNegocios = useCallback(async (
        filtrosAtuais = filtros,
        categoriaFiltro = categoriaAtiva,
        termoBusca = ""
    ) => {
        try {
            setCarregando(true);
            setErroApi(false);

            // 1. Busca os dados brutos da API C#
            let dados = await listarTodosOsNegocios();
            dados = (dados as any)?.items ? (dados as any).items : (Array.isArray(dados) ? dados : []);

            const termo = termoBusca.toLowerCase().trim();
            const categoriaAlvo = categoriaFiltro.toLowerCase().trim();

            // 2. Mapeamento e Filtragem Rígida
            const dadosFormatados = dados
                .map((backendItem: any) => {
                    const localizacaoReal = backendItem.address || backendItem.location || backendItem.endereco || "Gaibu";

                    // Se o banco trouxer null, undefined ou 0, definimos como "N/A" (Sem Avaliação)
                    const notaBanco = backendItem.rating || backendItem.nota || backendItem.avaliacao;
                    const notaReal = (notaBanco && notaBanco > 0) ? Number(notaBanco).toFixed(1) : "N/A";

                    return {
                        id: backendItem.id,
                        nome: backendItem.name || backendItem.nome || "Sem Nome",
                        desc: localizacaoReal,
                        img: backendItem.businessPhotoUrl || "/images/fundopraia.jpg",
                        nota: notaReal, // Passa "N/A" ou a nota real (ex: 4.5) pro CardServico
                        aberto: backendItem.status ?? true,
                        aceitaCard: backendItem.cartao ?? backendItem.aceitaCard ?? false,
                        chuveiro: backendItem.chuveiro ?? false,
                        estacionamento: backendItem.estacionamento ?? false,
                        cadeira: backendItem.cadeira ?? false,
                        petFriendly: backendItem.petFriendly ?? false,
                        acessibilidade: backendItem.acessibilidade ?? false,
                        serviceTypeCsharp: String(backendItem.serviceType ?? backendItem.tipoServico ?? "")
                    };
                })
                .filter((item: any) => {
                    // FILTRO DE BUSCA POR TEXTO
                    if (termo) {
                        const bateNome = item.nome.toLowerCase().includes(termo);
                        const bateLocal = item.desc.toLowerCase().includes(termo);
                        if (!bateNome && !bateLocal) return false;
                    }

                    if (categoriaAlvo) {
                        // Compara direto o ID da URL ("0", "1", "2", "3", "4") com o do banco.
                        // Se for diferente, o item some da tela na hora!
                        if (item.serviceTypeCsharp !== categoriaAlvo) {
                            return false;
                        }
                    }

                    // FILTROS LATERAIS (ASIDE)
                    if (filtrosAtuais.chuveiro && !item.chuveiro) return false;
                    if (filtrosAtuais.estacionamento && !item.estacionamento) return false;
                    if (filtrosAtuais.cadeira && !item.cadeira) return false;
                    if (filtrosAtuais.petFriendly && !item.petFriendly) return false;
                    if (filtrosAtuais.acessibilidade && !item.acessibilidade) return false;

                    if (filtrosAtuais.localizacao && !item.desc.toLowerCase().includes(filtrosAtuais.localizacao.toLowerCase())) {
                        return false;
                    }

                    return true;
                });

            setListaNegocios(dadosFormatados);

        } catch (error) {
            console.error("Erro ao carregar dados do GuiaOrlaPE.API:", error);
            setErroApi(true);
        } finally {
            setCarregando(false);
        }
    }, [filtros, categoriaAtiva]);

    // Sincroniza a categoria e o texto de busca vinda da URL/Header e refaz a busca automaticamente
    useEffect(() => {
        const catUrl = searchParams.get("categoria") || "";
        const buscaUrl = searchParams.get("search") || "";

        setCategoriaAtiva(catUrl);
        carregarNegocios(filtros, catUrl, buscaUrl);
    }, [searchParams, carregarNegocios, filtros]);

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
                            onClick={() => {
                                const buscaUrl = searchParams.get("search") || "";
                                carregarNegocios(filtros, categoriaAtiva, buscaUrl);
                            }}
                            className="w-full mt-3 py-2 bg-[#0A4F6E] text-white rounded-lg font-bold hover:bg-[#083d55] transition-colors shadow-sm text-[11px]"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </aside>

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
                                    <div className="relative flex items-start pt-2 px-0 md:px-10 group">

                                        {/* SETA ESQUERDA: Só aparece no Desktop E se houver mais de 4 itens na lista */}
                                        {listaNegocios.length > 4 && (
                                            <button
                                                onClick={() => scroll("left")}
                                                className="absolute left-0 top-[40%] -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-[#0A4F6E] hover:scale-110 transition-all hidden md:flex items-center justify-center border border-gray-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                            </button>
                                        )}

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

                                        {/* SETA DIREITA: Só aparece no Desktop E se houver mais de 4 itens na lista */}
                                        {listaNegocios.length > 4 && (
                                            <button
                                                onClick={() => scroll("right")}
                                                className="absolute right-0 top-[40%] -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-[#0A4F6E] hover:scale-110 transition-all hidden md:flex items-center justify-center border border-gray-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                            </button>
                                        )}

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
                                            <div key={item.id} className="h-fit">
                                                <CardServico
                                                    item={item}
                                                    variante="horizontal"
                                                    isEmpreendedor={isEmpreendedor}
                                                    onOpenModal={(item) => setServicoSelecionado(item)}
                                                />
                                            </div>
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