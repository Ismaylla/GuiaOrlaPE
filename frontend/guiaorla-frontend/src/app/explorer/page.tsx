"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Importando nossos componentes novos
import { FiltrosInterface } from "@/components/ListagemServicos/FiltrosInterface";
import { CardServico } from "@/components/ListagemServicos/CardServico";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";

const SERVICOS_MOCK = [
    { id: 1, nome: "Raio de Sol: Cocos e Frutas", categoria: "Barracas e Ambulantes", nota: 4.8, desc: "Beira-mar de Gaibu (Próximo ao Posto 4). Coco gelado na hora | Frutas da estação", img: "/images/coco.jpg", aberto: true, aceitaCard: true },
    { id: 2, nome: "Passeio de Buggy: Ricardo", categoria: "Passeios e Lazer", nota: 4.9, desc: "O melhor passeio da região. Explore as piscinas naturais e trilhas com segurança e conforto.", img: "/images/acai.jpg", aberto: true, aceitaCard: true },
    { id: 3, nome: "Hot Dog do Bruno", categoria: "Barracas e Ambulantes", nota: 4.5, desc: "Melhor hot dog da região. Ingredientes frescos e molho especial da casa todos os dias.", img: "/images/hotdog.jpg", aberto: false, aceitaCard: true },
    { id: 4, nome: "Pousada Oxente", categoria: "Hospedagem", nota: 4.8, desc: "Conforto e beira mar com o melhor café da manhã. Suítes equipadas com ar-condicionado.", img: "/images/coco.jpg", aberto: true, aceitaCard: true },
    { id: 5, nome: "Artesanato da Ilha", categoria: "Artesanato Local", nota: 4.9, desc: "Peças exclusivas feitas por artistas locais. Leve um pedaço da nossa ilha com você.", img: "/images/acai.jpg", aberto: true, aceitaCard: false },
    { id: 6, nome: "Restaurante Mar Aberto", categoria: "Bares e Restaurantes", nota: 4.7, desc: "Frutos do mar frescos e vista privilegiada. Pratos individuais e para família.", img: "/images/hotdog.jpg", aberto: true, aceitaCard: true },
];

export default function ExplorarServicos() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Barracas e Ambulantes");
    const [scrolled, setScrolled] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const navRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [filtros, setFiltros] = useState({
        precoMinManual: "",
        precoMaxManual: "",
        faixaPreco: "",
        cartao: true,
        chuveiro: false,        // NOVO
        estacionamento: false,  // NOVO
        cadeira: false,         // NOVO
        petFriendly: false,
        acessibilidade: false,
        melhoresAvaliados: false
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
            {/* COMPONENTE HEADER */}
            <HeaderListagem
                scrolled={scrolled}
                categoriaAtiva={categoriaAtiva}
                setCategoriaAtiva={setCategoriaAtiva}
                setIsFilterOpen={setIsFilterOpen}
                navRef={navRef}
                handleMouseDown={handleMouseDown}
            />

            {/* MODAL DE FILTROS MOBILE */}
            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsFilterOpen(false)}></div>
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 shadow-2xl transition-all duration-300 ${isFilterOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
                    <h3 className="text-[#0A4F6E] font-bold text-xl mb-6">Filtros</h3>
                    <FiltrosInterface filtros={filtros} setFiltros={setFiltros} fecharModal={() => setIsFilterOpen(false)} contexto="modal" />
                    <button onClick={() => setIsFilterOpen(false)} className="w-full mt-8 py-4 bg-[#0A4F6E] text-white rounded-2xl font-bold">Aplicar filtros</button>
                </div>
            </div>

            <div className="h-28 md:h-32"></div>

            {/* BARRA DE BUSCA PRINCIPAL */}
            <div className={`w-full flex justify-center py-6 px-4 transition-all duration-500 ${scrolled ? "opacity-0 -translate-y-10 h-0 overflow-hidden" : "opacity-100"}`}>
                <div className="flex items-center gap-2 md:gap-[10px] w-full max-w-7xl justify-center">
                    <div className="shrink-0"><Image src="/images/LOGOfundotransparente 3.png" alt="Logo Principal" width={55} height={55} /></div>
                    <div className="relative flex-1 max-w-[800px]">
                        <input type="text" placeholder="Para qual praia vamos hoje?" className="w-full h-12 pl-6 pr-4 rounded-xl bg-white border border-gray-300 text-[#0A4F6E] transition-all duration-300 focus:outline-none focus:ring-0 focus:shadow-lg focus:shadow-[#0A4F6E]/10" />
                    </div>
                    <div className="shrink-0 cursor-pointer active:scale-90 transition-transform">
                        <Image src="/icons/Perfil.svg" alt="Perfil" width={35} height={35} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-8 mt-4 relative">
                {/* ASIDE DE FILTROS DESKTOP - Padding reduzido e margens menores */}
                <aside className="hidden md:flex flex-col gap-3 md:sticky md:top-20 h-fit self-start min-w-[260px]">
                    <div className="w-full h-40 rounded-xl overflow-hidden relative border border-gray-200 shadow-sm cursor-pointer group">
                        <Image src="/images/map-placeholder.png" alt="Mapa" fill className="object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-[#0A4F6E]/20 flex items-center justify-center">
                            <button className="bg-white text-[#0A4F6E] px-4 py-2 rounded-lg text-sm font-bold shadow-md">Ver no mapa</button>
                        </div>
                    </div>

                    {/* P-3 (era 5) e botão mt-3 (era 8) */}
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-[#0A4F6E] font-bold text-base mb-3 border-b pb-1">Refinar busca:</h3>
                        <FiltrosInterface filtros={filtros} setFiltros={setFiltros} contexto="aside" />
                        <button className="w-full mt-3 py-2.5 bg-[#0A4F6E] text-white rounded-lg font-bold hover:bg-[#083d55] transition-colors shadow-sm text-sm">
                            Aplicar filtros
                        </button>
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="mb-10 text-center">
                        <h1 className="text-[#FF7620] text-2xl font-bold">Olá, seja bem-vindo ao GuiaOrla! ☀️</h1>
                        <p className="text-[#0A4F6E]/70 text-base px-2">Explore os melhores pontos da orla de Pernambuco.</p>
                    </div>

                    {/* SEÇÃO CARROSSEL (PRÓXIMOS) */}
                    <section className="mb-16">
                        <h2 className="text-[#0A4F6E] text-xl font-bold italic mb-6 text-center">Próximos de você</h2>
                        <div className="relative flex items-start px-0 md:px-12">
                            <button onClick={() => scroll("left")} className="absolute left-0 top-[180px] -translate-y-1/2 z-20 hover:scale-110 transition-transform hidden md:block">
                                <Image src="/icons/SetaAzul.svg" width={32} height={32} alt="ant" />
                            </button>
                            <div ref={scrollRef} onMouseDown={handleMouseDown(scrollRef)}
                                className="flex overflow-x-auto gap-4 md:gap-5 w-full pb-8 scrollbar-hide snap-x items-start px-4 md:px-0 cursor-grab active:cursor-grabbing"
                            >
                                {SERVICOS_MOCK.map((item) => (
                                    <CardServico key={item.id} item={item} variante="vertical" />
                                ))}
                            </div>
                            <button onClick={() => scroll("right")} className="absolute right-0 top-[180px] -translate-y-1/2 z-20 hover:scale-110 transition-transform rotate-180 hidden md:block">
                                <Image src="/icons/SetaAzul.svg" width={32} height={32} alt="prox" />
                            </button>
                        </div>
                    </section>

                    <hr className="w-full border-gray-300 mb-12" />

                    {/* SEÇÃO LISTAGEM GERAL */}
                    <section>
                        <h2 className="text-[#0A4F6E] text-xl font-bold mb-10 italic text-center">Todos os estabelecimentos</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12 px-2 md:px-0">
                            {SERVICOS_MOCK.map((item) => (
                                <CardServico key={item.id} item={item} variante="horizontal" />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}