"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic"; // <-- IMPORTAÇÃO DINÂMICA ADICIONADA AQUI

import { FiltrosInterface } from "@/components/ListagemServicos/FiltrosInterface";
import { CardServico } from "@/components/ListagemServicos/CardServico";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { ModalVerMais } from "@/components/ListagemServicos/ModalVerMais";
import { AvisoPerfil } from "@/components/Empreendedor/AvisoPerfil";

import { listarTodosOsNegocios, buscarNegociosComFiltros } from "@/services/businessService";
import { calcularDistancia } from "@/lib/geoUtils"; // Adicione esta linha

// IMPORTA O MAPA DESLIGANDO A RENDERIZAÇÃO NO SERVIDOR
const MapaOrlaDinamico = dynamic(() => import("@/components/Mapa/MapaOrla"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center text-[#0A4F6E] text-xs font-bold rounded-xl">Carregando mapa...</div>
});

interface ExplorerScreenProps {
    isEmpreendedor: boolean;
}

//  FUNÇÃO DE FORMATAÇÃO MANTIDA
const formatarUrlImagem = (url?: string) => {
    if (!url || typeof url !== "string" || url.trim() === "") return null;
    if (url.startsWith("http")) return url;
    return `http://localhost:5148${url}`;
};

export const ExplorerScreen = ({ isEmpreendedor }: ExplorerScreenProps) => {
    const searchParams = useSearchParams();
    const [categoriaAtiva, setCategoriaAtiva] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [listaNegocios, setListaNegocios] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroApi, setErroApi] = useState(false);

    const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);

    const navRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const temDados = listaNegocios.length > 0;

    const [posicaoUsuario, setPosicaoUsuario] = useState<{ lat: number, lon: number } | null>(null);
    const [listaMaisProximos, setListaMaisProximos] = useState<any[]>([])

    // ESTADO LIMPO (Sem referências de preços)
    // const [filtros, setFiltros] = useState({
    //     localizacao: "", 
    //     cartao: true, chuveiro: false, estacionamento: false, cadeira: false,
    //     petFriendly: false, acessibilidade: false, melhoresAvaliados: false
    // });

    const [filtros, setFiltros] = useState({
        localizacao: "",
        cartao: false, // Alterado de true para false para não filtrar nada por padrão
        chuveiro: false,
        estacionamento: false,
        cadeira: false,
        petFriendly: false,
        acessibilidade: false,
        melhoresAvaliados: false
    });



    const carregarNegocios = useCallback(async (
        filtrosAtuais = filtros,
        categoriaFiltro = categoriaAtiva,
        termoBusca = ""
    ) => {
        try {
            setCarregando(true);
            setErroApi(false);

            //  AGORA CHAMA A API PASSANDO OS FILTROS REAIS PARA O C# FILTRAR NO BANCO
            const respostaApi = await buscarNegociosComFiltros(filtrosAtuais, categoriaFiltro, termoBusca);

            // Blindagem para extrair os itens independente se a API responder com 'items' ou 'Items'
            const dados = respostaApi?.items ?? respostaApi?.Items ?? (Array.isArray(respostaApi) ? respostaApi : []);

            const dadosFormatados = dados.map((backendItem: any) => {
                const localizacaoReal = backendItem.address || backendItem.location || backendItem.endereco || "Gaibu";
                const notaBanco = backendItem.rating || backendItem.nota || backendItem.avaliacao;
                const notaReal = (notaBanco && notaBanco > 0) ? Number(notaBanco).toFixed(1) : "N/A";

                // BLINDAGEM DE CASING
                const fotoPerfilBackend = backendItem.businessPhotoUrl || backendItem.BusinessPhotoUrl;
                const fotoVitrineBackend = backendItem.cardImageUrl || backendItem.CardImageUrl;
                const donoIdBackend = backendItem.userId || backendItem.UserId;

                return {
                    id: backendItem.id || backendItem.Id,
                    userId: donoIdBackend,
                    nome: backendItem.name || backendItem.nome || backendItem.Name || "Sem Nome",
                    desc: localizacaoReal,
                    img: formatarUrlImagem(fotoPerfilBackend) || "/images/fundopraia.jpg",
                    cardImageUrl: formatarUrlImagem(fotoVitrineBackend),
                    nota: notaReal,
                    aberto: backendItem.status ?? true,
                    latitude: backendItem.latitude ?? backendItem.Latitude ?? 0,
                    longitude: backendItem.longitude ?? backendItem.Longitude ?? 0,
                    aceitaCard: backendItem.cartao ?? backendItem.Cartao ?? backendItem.aceitaCard ?? false,
                    chuveiro: backendItem.chuveiro ?? backendItem.Chuveiro ?? false,
                    estacionamento: backendItem.estacionamento ?? backendItem.Estacionamento ?? false,
                    cadeira: backendItem.cadeira ?? backendItem.Cadeira ?? false,
                    petFriendly: backendItem.petFriendly ?? backendItem.PetFriendly ?? false,
                    acessibilidade: backendItem.acessibilidade ?? backendItem.Acessibilidade ?? false,
                    serviceTypeCsharp: String(backendItem.serviceType ?? backendItem.ServiceType ?? backendItem.tipoServico ?? ""),
                    description: backendItem.description ?? backendItem.Description ?? "",
                    horario: backendItem.horario ?? backendItem.Horario ?? "08:00 às 18:00",
                };
            });

            setListaNegocios(dadosFormatados);

        } catch (error) {
            console.error("Erro ao carregar dados da API:", error);
            setErroApi(true);
        } finally {
            setCarregando(false);
        }
    }, [filtros, categoriaAtiva]);

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

    useEffect(() => { document.body.style.overflow = servicoSelecionado ? "hidden" : "auto"; }, [servicoSelecionado]);

    const handleMouseDown = (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => {
        if (!ref.current || ref.current.scrollWidth <= ref.current.clientWidth) return;
        const ele = ref.current;
        const startX = e.pageX - ele.offsetLeft;
        const scrollLeft = ele.scrollLeft;
        const handleMouseMove = (le: MouseEvent) => { const x = le.pageX - ele.offsetLeft; ele.scrollLeft = scrollLeft - (x - startX) * 2; };
        const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
        document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setPosicaoUsuario({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                (err) => console.warn("Localização negada pelo usuário")
            );
        }
    }, []);

    useEffect(() => {
        if (posicaoUsuario && listaNegocios.length > 0) {
            const comDistancia = listaNegocios.map(item => ({
                ...item,
                distancia: calcularDistancia(posicaoUsuario.lat, posicaoUsuario.lon, item.latitude, item.longitude)
            }));
            setListaMaisProximos(comDistancia.sort((a, b) => a.distancia - b.distancia).slice(0, 5));
        }
    }, [listaNegocios, posicaoUsuario]);





    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - (clientWidth * 0.8) : scrollLeft + (clientWidth * 0.8);
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f6f6] font-sans pb-20">
            <HeaderListagem scrolled={scrolled} categoriaAtiva={categoriaAtiva} setCategoriaAtiva={setCategoriaAtiva} setIsFilterOpen={setIsFilterOpen} navRef={navRef} handleMouseDown={handleMouseDown} isEmpreendedor={isEmpreendedor} forceBlue={true} />
            <div className="h-16 md:h-20"></div>

            {servicoSelecionado && <ModalVerMais item={servicoSelecionado} isEmpreendedor={isEmpreendedor} onClose={() => setServicoSelecionado(null)} />}

            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsFilterOpen(false)}></div>
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 shadow-2xl transition-all duration-300 ${isFilterOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-[#0A4F6E] font-bold text-lg mb-4">Filtros</h3>
                    <FiltrosInterface filtros={filtros} setFiltros={setFiltros} contexto="modal" />
                    <button onClick={() => { setIsFilterOpen(false); carregarNegocios(); }} className="w-full mt-6 py-3.5 bg-[#0A4F6E] text-white rounded-2xl font-bold">Aplicar filtros</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 mt-4 md:mt-6 relative">
                <aside className="hidden md:flex flex-col gap-2 sticky top-[104px] h-fit self-start">

                    <div className="w-full h-[250px] rounded-xl overflow-hidden relative border border-gray-200 shadow-sm">
                        <MapaOrlaDinamico negocios={listaNegocios} />
                    </div>

                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mt-2">
                        <h3 className="text-[#0A4F6E] font-bold text-[11px] mb-2 border-b pb-1 uppercase tracking-tighter">Refinar busca</h3>
                        <FiltrosInterface filtros={filtros} setFiltros={setFiltros} contexto="aside" />
                        <button onClick={() => { const buscaUrl = searchParams.get("search") || ""; carregarNegocios(filtros, categoriaAtiva, buscaUrl); }} className="w-full mt-3 py-2 bg-[#0A4F6E] text-white rounded-lg font-bold hover:bg-[#083d55] transition-colors shadow-sm text-[11px]">Aplicar filtros</button>
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

                            <AvisoPerfil />

                            <section className="mb-12 md:mb-16">
                                <h2 className="text-[#0A4F6E] text-lg md:text-xl font-bold italic mb-4 md:mb-6 text-center md:text-left tracking-tight">Próximos de você</h2>
                                {temDados ? (
                                    <div className="relative flex items-start pt-2 px-0 md:px-10 group">
                                        {listaNegocios.length > 4 && (
                                            <button onClick={() => scroll("left")} className="absolute left-0 top-[40%] -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-[#0A4F6E] hover:scale-110 transition-all hidden md:flex items-center justify-center border border-gray-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                            </button>
                                        )}

                                        <div ref={scrollRef} onMouseDown={handleMouseDown(scrollRef)} className="flex overflow-x-auto gap-4 md:gap-5 w-full pb-6 scrollbar-hide snap-x items-start cursor-grab active:cursor-grabbing">
                                            {(posicaoUsuario ? listaMaisProximos : listaNegocios).map((item) => (
                                                <CardServico key={item.id} item={item} variante="vertical" isEmpreendedor={isEmpreendedor} onOpenModal={(item) => setServicoSelecionado(item)} />
                                            ))}
                                        </div>

                                        {listaNegocios.length > 4 && (
                                            <button onClick={() => scroll("right")} className="absolute right-0 top-[40%] -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-[#0A4F6E] hover:scale-110 transition-all hidden md:flex items-center justify-center border border-gray-100">
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
                                                <CardServico item={item} variante="horizontal" isEmpreendedor={isEmpreendedor} onOpenModal={(item) => setServicoSelecionado(item)} />
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