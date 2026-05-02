"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { PerfilHeader } from "@/components/PerfilPublico/PerfilHeader";
import { ModalUpload } from "./ModalUpload";
import { ModalSobre } from "./ModalSobre"; 
import { SecaoFeedback } from "@/components/PerfilPublico/SecaoFeedback";
import { Clock, MapPin, CreditCard, Sparkles } from "lucide-react";

export const MeuPerfilScreen = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isModalSobreOpen, setIsModalSobreOpen] = useState(false);
    
    // Controle do Modal de Upload
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState<"galeria" | "header">("galeria");

    const navRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [dadosNegocio, setDadosNegocio] = useState({
        nome: "Meu Negócio Gaibu",
        sobre: "Os melhores cocos e frutas selecionadas da Praia de Gaibu. Atendimento diferenciado e qualidade garantida.",
        localizacao: "Defina sua localização",
        horario: "Defina seu horário",
        pagamentos: ["Pix"],
        comodidades: ["Nenhuma"],
        nota: 5.0,
        totalAvaliacoes: 0
    });

    useEffect(() => {
        const salvo = localStorage.getItem("dadosNegocio");
        if (salvo) {
            const d = JSON.parse(salvo);
            setDadosNegocio(prev => ({
                ...prev,
                sobre: d.sobre || prev.sobre,
                horario: d.horario || prev.horario,
                localizacao: d.localizacao || prev.localizacao,
                pagamentos: d.pagamentos || prev.pagamentos,
                comodidades: d.comodidades || prev.comodidades,
            }));
        }
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // AJUSTE: Função que lida com o clique na categoria e redireciona para o explorer
    const handleCategoryClick = (cat: string) => {
        router.push(`/empreendedor/explorer?categoria=${encodeURIComponent(cat)}`);
    };

    // Função para abrir o upload correto
    const handleOpenUpload = (tipo: "galeria" | "header") => {
        setUploadType(tipo);
        setIsUploadModalOpen(true);
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
        <main className="min-h-screen bg-[#F0F2F5] font-sans pb-20 text-left">
            {/* AJUSTE: setCategoriaAtiva agora recebe handleCategoryClick para permitir navegação */}
            <HeaderListagem 
                isEmpreendedor={true} 
                forceBlue={true} 
                scrolled={scrolled} 
                categoriaAtiva="" 
                setCategoriaAtiva={handleCategoryClick} 
                showFilter={false} 
                setIsFilterOpen={() => {}} 
                navRef={navRef} 
                handleMouseDown={handleMouseDown} 
            />
            
            <div className="h-16"></div>

            <div className="max-w-[1100px] mx-auto">
                <PerfilHeader 
                    podeEditar={true} 
                    onEditCover={() => handleOpenUpload("header")} 
                />
                
                <div className="px-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 mt-4">
                    <aside className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-[#0A4F6E] text-lg">Sobre meu Negócio</h3>
                                <button onClick={() => setIsModalSobreOpen(true)} className="text-xs font-bold text-[#1398D4] hover:underline">Editar Bio</button>
                             </div>
                             <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                {dadosNegocio.sobre}
                             </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-5">
                            <h3 className="font-bold text-[#0A4F6E] text-lg">Dados Operacionais</h3>
                            <InfoRow icon={<Clock size={18} className="text-[#1398D4]" />} label="Seu Horário" value={dadosNegocio.horario} />
                            <InfoRow icon={<MapPin size={18} className="text-[#1398D4]" />} label="Sua Localização" value={dadosNegocio.localizacao} />
                            <InfoRow icon={<CreditCard size={18} className="text-[#1398D4]" />} label="Seus Pagamentos" value={dadosNegocio.pagamentos.join(", ")} />
                            <InfoRow icon={<Sparkles size={18} className="text-[#1398D4]" />} label="Suas Comodidades" value={dadosNegocio.comodidades.join(" • ")} />
                        </div>
                    </aside>

                    <section className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[300px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0A4F6E] text-xl italic">Minha Galeria</h3>
                                <button onClick={() => handleOpenUpload("galeria")} className="text-sm font-bold text-[#1398D4] hover:underline">+ Adicionar Fotos</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200"></div>
                            </div>
                        </div>
                        <SecaoFeedback nota={dadosNegocio.nota} totalAvaliacoes={dadosNegocio.totalAvaliacoes} exibirBotaoAvaliar={false} />
                    </section>
                </div>
            </div>

            <ModalSobre 
                isOpen={isModalSobreOpen} 
                onClose={() => setIsModalSobreOpen(false)} 
                valorAtual={dadosNegocio.sobre}
                onSave={(novo) => {
                    const d = {...dadosNegocio, sobre: novo};
                    setDadosNegocio(d);
                    localStorage.setItem("dadosNegocio", JSON.stringify(d));
                }}
            />
            
            <ModalUpload 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                tipo={uploadType} 
            />
        </main>
    );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm text-[#0A4F6E] font-medium leading-tight">{value}</span>
        </div>
    </div>
);