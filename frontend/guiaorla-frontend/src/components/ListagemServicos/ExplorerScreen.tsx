"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { FiltrosInterface } from "@/components/ListagemServicos/FiltrosInterface";
import { CardServico } from "@/components/ListagemServicos/CardServico";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { ModalVerMais } from "@/components/ListagemServicos/ModalVerMais";

const SERVICOS_MOCK = [
    { id: 1, nome: "Raio de Sol: Cocos e Frutas", categoria: "Barracas e Ambulantes", nota: 4.8, desc: "Beira-mar de Gaibu (Próximo ao Posto 4). Coco gelado na hora | Frutas da estação", img: "/images/coco.jpg", aberto: true, aceitaCard: true },
    { id: 2, nome: "Passeio de Buggy: Ricardo", categoria: "Passeios e Lazer", nota: 4.9, desc: "O melhor passeio da região. Explore as piscinas naturais e trilhas com segurança e conforto.", img: "/images/acai.jpg", aberto: true, aceitaCard: true },
    { id: 3, nome: "Hot Dog do Bruno", categoria: "Barracas e Ambulantes", nota: 4.5, desc: "Melhor hot dog da região. Ingredientes frescos e molho especial da casa todos os dias.", img: "/images/hotdog.jpg", aberto: false, aceitaCard: true },
    { id: 4, nome: "Pousada Oxente", categoria: "Hospedagem", nota: 4.8, desc: "Conforto e beira mar com o melhor café da manhã. Suítes equipadas com ar-condicionado.", img: "/images/coco.jpg", aberto: true, aceitaCard: true },
    { id: 5, nome: "Artesanato da Ilha", categoria: "Artesanato Local", nota: 4.9, desc: "Peças exclusivas feitas por artistas locais. Leve um pedaço da nossa ilha com você.", img: "/images/acai.jpg", aberto: true, aceitaCard: false },
    { id: 6, nome: "Restaurante Mar Aberto", categoria: "Bares e Restaurantes", nota: 4.7, desc: "Frutos do mar frescos e vista privilegiada. Pratos individuais e para família.", img: "/images/hotdog.jpg", aberto: true, aceitaCard: true },
];

interface ExplorerScreenProps {
    isEmpreendedor: boolean;
}

export const ExplorerScreen = ({ isEmpreendedor }: ExplorerScreenProps) => {
    const searchParams = useSearchParams();
    const [categoriaAtiva, setCategoriaAtiva] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);

    const navRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const temDados = SERVICOS_MOCK.length > 0;

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

    useEffect(() => {
        const catUrl = searchParams.get("categoria");
        if (catUrl) setCategoriaAtiva(catUrl);
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

            {/* Espaçador entre Header e o Grid */}
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
                    <button onClick={() => setIsFilterOpen(false)} className="w-full mt-6 py-3.5 bg-[#0A4F6E] text-white rounded-2xl font-bold">Aplicar filtros</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 mt-4 md:mt-6 relative">
                {/* ASIDE COM STICKY AJUSTADO */}
                {/* Mudei top-20 para top-[104px] para manter o espaçamento idêntico ao carregamento da página */}
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
                        <button className="w-full mt-3 py-2 bg-[#0A4F6E] text-white rounded-lg font-bold hover:bg-[#083d55] transition-colors shadow-sm text-[11px]">
                            Aplicar filtros
                        </button>
                    </div>
                </aside>

                {/* CONTEÚDO PRINCIPAL */}
                <div className="min-w-0">
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
                                    {SERVICOS_MOCK.map((item) => (
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
                                <p className="text-gray-500 text-sm italic">Nenhum serviço encontrado próximo a você.</p>
                            </div>
                        )}
                    </section>

                    <hr className="w-full border-gray-200 mb-10 md:mb-12" />

                    <section>
                        <h2 className="text-[#0A4F6E] text-lg md:text-xl font-bold mb-6 md:mb-8 italic text-center md:text-left tracking-tight">Todos os estabelecimentos</h2>
                        {temDados ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                                {SERVICOS_MOCK.map((item) => (
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
                </div>
            </div>
        </main>
    );
};