"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { PerfilHeader } from "@/components/PerfilPublico/PerfilHeader";
import { SecaoFeedback } from "@/components/PerfilPublico/SecaoFeedback";
import { Clock, MapPin, CreditCard, Sparkles, Star } from "lucide-react";

interface PerfilPublicoScreenProps {
    isEmpreendedor: boolean;
}

export const PerfilPublicoScreen = ({ isEmpreendedor }: PerfilPublicoScreenProps) => {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    const dadosEstaticos = {
        nome: "Barraca do Coco Selecionado",
        localizacao: "Praia de Gaibu, Cabo de Santo Agostinho",
        horario: "08:00 às 18:00",
        pagamentos: ["Pix", "Cartão de Crédito", "Dinheiro"],
        comodidades: ["Wi-fi Grátis", "Pet Friendly", "Ducha/Chuveiro"],
        nota: 4.8,
        totalAvaliacoes: 124
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCategoryClick = (cat: string) => {
        const baseRoute = isEmpreendedor ? "/empreendedor/explorer" : "/explorer";
        router.push(`${baseRoute}?categoria=${encodeURIComponent(cat)}`);
    };

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

    return (
        <main className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
            <HeaderListagem isEmpreendedor={isEmpreendedor} forceBlue={true} scrolled={scrolled} categoriaAtiva="" setCategoriaAtiva={handleCategoryClick} showFilter={false} setIsFilterOpen={() => {}} navRef={navRef} handleMouseDown={handleMouseDown} />
            <div className="h-16"></div>

            <div className="max-w-[1100px] mx-auto">
                <PerfilHeader podeEditar={false} />
                <div className="px-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 mt-4 text-left">
                    <aside className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-[#0A4F6E] text-lg">Sobre</h3>
                                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                                    <span className="text-[#FF7620] font-bold text-sm">{dadosEstaticos.nota}</span>
                                    <Star size={12} className="text-[#FF7620] fill-[#FF7620]" />
                                </div>
                             </div>
                             <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                {dadosEstaticos.nome}: Os melhores cocos e frutas selecionadas da Praia de Gaibu. 
                             </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-5">
                            <h3 className="font-bold text-[#0A4F6E] text-lg">Informações</h3>
                            <InfoRow icon={<Clock size={18} className="text-[#1398D4]" />} label="Funcionamento" value={dadosEstaticos.horario} />
                            <InfoRow icon={<MapPin size={18} className="text-[#1398D4]" />} label="Onde estamos" value={dadosEstaticos.localizacao} />
                            <InfoRow icon={<CreditCard size={18} className="text-[#1398D4]" />} label="Pagamentos" value={dadosEstaticos.pagamentos.join(", ")} />
                            <InfoRow icon={<Sparkles size={18} className="text-[#1398D4]" />} label="Comodidades" value={dadosEstaticos.comodidades.join(" • ")} />
                        </div>
                    </aside>

                    <section className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                            <h3 className="font-bold text-[#0A4F6E] text-xl italic mb-6">Galeria de Fotos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200"></div>
                                <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
                            </div>
                        </div>
                        {/* Botão Avaliar ATIVADO para o turista */}
                        <SecaoFeedback nota={dadosEstaticos.nota} totalAvaliacoes={dadosEstaticos.totalAvaliacoes} exibirBotaoAvaliar={true} />
                    </section>
                </div>
            </div>
        </main>
    );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm text-[#0A4F6E] font-medium leading-tight">{value}</span>
        </div>
    </div>
);