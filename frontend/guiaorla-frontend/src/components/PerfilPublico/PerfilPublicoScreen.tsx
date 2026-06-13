"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image"; 
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { PerfilHeader } from "@/components/PerfilPublico/PerfilHeader";
import { SecaoFeedback } from "@/components/PerfilPublico/SecaoFeedback";
import { Clock, MapPin, CreditCard, Sparkles, Star, Loader2 } from "lucide-react";
import { buscarNegocioPorId, listarAvaliacoesDoNegocio } from "@/services/businessService";

import { ModalUpload } from "./ModalUpload";
import { ModalSobre } from "./ModalSobre";

interface PerfilPublicoScreenProps {
    isEmpreendedor: boolean;
}

export const PerfilPublicoScreen = ({ isEmpreendedor }: PerfilPublicoScreenProps) => {
    const router = useRouter();
    const { data: session } = useSession(); 
    const params = useParams(); 
    const idNegocio = params?.id as string;

    const [scrolled, setScrolled] = useState(false);
    const [negocio, setNegocio] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    const [isModalSobreOpen, setIsModalSobreOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState<"galeria" | "header" | "profile">("galeria");

    const navRef = useRef<HTMLDivElement>(null);

    const usuarioLogadoId = (session as any)?.user?.id || (session as any)?.id;
    const isOwner = !!(session && negocio && negocio.userId === usuarioLogadoId);

    useEffect(() => {
        const carregarPerfil = async () => {
            if (!idNegocio) return;
            try {
                setCarregando(true);
                setErro(false);

                const dados = await buscarNegocioPorId(idNegocio);
                const avaliacoes = await listarAvaliacoesDoNegocio(idNegocio);

                const total = avaliacoes.length;
                const media = total > 0 
                    ? avaliacoes.reduce((acc: number, item: any) => acc + item.stars, 0) / total 
                    : 0.0;

                const pagamentosLista: string[] = [];
                if (dados.pix ?? dados.Pix) pagamentosLista.push("Pix");
                if (dados.cartao ?? dados.Cartao) pagamentosLista.push("Cartão");
                if (dados.dinheiro ?? dados.Dinheiro) pagamentosLista.push("Dinheiro");

                const comodidadesLista: string[] = [];
                if (dados.chuveiro ?? dados.Chuveiro) comodidadesLista.push("Chuveirão");
                if (dados.estacionamento ?? dados.Estacionamento) comodidadesLista.push("Estacionamento");
                if (dados.cadeira ?? dados.Cadeira) comodidadesLista.push("Cadeira de Sol");
                if (dados.petFriendly ?? dados.PetFriendly) comodidadesLista.push("Pet Friendly");
                if (dados.acessibilidade ?? dados.Acessibilidade) comodidadesLista.push("Acessibilidade");
                if (dados.wifi ?? dados.Wifi) comodidadesLista.push("Wi-Fi Grátis");

                setNegocio({
                    id: dados.id ?? dados.Id,
                    userId: dados.userId ?? dados.UserId, 
                    nome: dados.name || "Sem Nome",
                    localizacao: dados.address || "Endereço não informado",
                    horario: dados.horario || dados.Horario || "Horário não informado", 
                    pagamentos: pagamentosLista.length > 0 ? pagamentosLista : ["Não informado"],
                    comodidades: comodidadesLista.length > 0 ? comodidadesLista : ["Nenhuma comodidade informada"],
                    nota: media, 
                    totalAvaliacoes: total, 
                    fotoCapa: (dados.coverPhotoUrl ?? dados.CoverPhotoUrl) ? `http://localhost:5148${dados.coverPhotoUrl ?? dados.CoverPhotoUrl}` : "",
                    fotoPerfil: (dados.businessPhotoUrl ?? dados.BusinessPhotoUrl) ? `http://localhost:5148${dados.businessPhotoUrl ?? dados.BusinessPhotoUrl}` : "",
                    description: dados.description ?? dados.Description ?? "", 
                    galleryPhotos: (dados.galleryPhotos ?? dados.GalleryPhotos ?? []).map((foto: string) => foto.startsWith("http") ? foto : `http://localhost:5148${foto}`)
                });
            } catch (error) {
                console.error("Erro ao carregar o perfil do negócio:", error);
                setErro(true);
            } finally {
                setCarregando(false);
            }
        };

        carregarPerfil();
    }, [idNegocio]);

    useEffect(() => {
        document.body.style.overflow = "auto";
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCategoryClick = (cat: string) => {
        const baseRoute = isEmpreendedor ? "/empreendedor/explorer" : "/explorer";
        router.push(`${baseRoute}?categoria=${encodeURIComponent(cat)}`);
    };

    const handleOpenUpload = (tipo: "galeria" | "header" | "profile") => {
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

    if (carregando) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-[#0A4F6E]" size={40} />
                <p className="text-gray-500 italic text-sm">Carregando dados do perfil...</p>
            </div>
        );
    }

    if (erro || !negocio) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-md border border-red-100 text-center max-w-md">
                    <p className="text-red-600 font-bold">Perfil não encontrado</p>
                    <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-[#0A4F6E] text-white rounded-xl text-xs font-bold">Voltar</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen h-full bg-[#F0F2F5] font-sans pb-20 text-left">
            <HeaderListagem isEmpreendedor={isEmpreendedor} forceBlue={true} scrolled={scrolled} categoriaAtiva="" setCategoriaAtiva={handleCategoryClick} showFilter={false} setIsFilterOpen={() => { }} navRef={navRef} handleMouseDown={handleMouseDown} />
            <div className="h-16"></div>

            <div className="max-w-[1100px] mx-auto">
                <PerfilHeader 
                    key={`${negocio.fotoPerfil}-${negocio.fotoCapa}`}
                    podeEditar={isOwner} 
                    onEditCover={() => handleOpenUpload("header")}
                    onEditProfile={() => handleOpenUpload("profile")}
                    nomeNegocio={negocio.nome} 
                    fotoCapa={negocio.fotoCapa} 
                    fotoPerfil={negocio.fotoPerfil}
                    localizacao={negocio.localizacao}
                />

                <div className="px-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 mt-4">
                    <aside className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-[#0A4F6E] text-lg">Sobre</h3>
                                <div className="flex items-center gap-2">
                                    {isOwner && (
                                        <button onClick={() => setIsModalSobreOpen(true)} className="text-xs font-bold text-[#1398D4] hover:underline mr-1">
                                            Editar Bio
                                        </button>
                                    )}
                                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                                        <span className="text-[#FF7620] font-bold text-sm">{negocio.nota.toFixed(1)}</span>
                                        <Star size={12} className="text-[#FF7620] fill-[#FF7620]" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                <span className="font-bold text-[#0A4F6E]">{negocio.nome}:</span>{" "}
                                {negocio.description || "Venha conhecer nosso espaço na orla!"}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-5">
                            <h3 className="font-bold text-[#0A4F6E] text-lg">Informações</h3>
                            <InfoRow icon={<Clock size={18} className="text-[#1398D4]" />} label="Funcionamento" value={negocio.horario} />
                            <InfoRow icon={<MapPin size={18} className="text-[#1398D4]" />} label="Onde estamos" value={negocio.localizacao} />
                            <InfoRow icon={<CreditCard size={18} className="text-[#1398D4]" />} label="Pagamentos" value={negocio.pagamentos.join(", ")} />
                            <InfoRow icon={<Sparkles size={18} className="text-[#1398D4]" />} label="Comodidades" value={negocio.comodidades.join(" • ")} />
                        </div>
                    </aside>

                    <section className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0A4F6E] text-xl italic">Galeria de Fotos</h3>
                                {isOwner && (
                                    <button onClick={() => handleOpenUpload("galeria")} className="text-sm font-bold text-[#1398D4] hover:underline">
                                        + Adicionar Fotos
                                    </button>
                                )}
                            </div>
                            
                            {negocio.galleryPhotos.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {negocio.galleryPhotos.map((foto: string, idx: number) => (
                                        <div key={idx} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                            {/* 🌟 AJUSTADO: unoptimized e fallback de erro para imagens da galeria */}
                                            <Image 
                                                src={foto} 
                                                alt={`Foto ${idx + 1}`} 
                                                fill 
                                                className="object-cover" 
                                                unoptimized={true}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 min-h-[220px] bg-gray-50/50">
                                    <p className="text-sm font-semibold text-gray-400">Nenhuma foto adicionada.</p>
                                </div>
                            )}
                        </div>
                        <SecaoFeedback nota={negocio.nota} totalAvaliacoes={negocio.totalAvaliacoes} exibirBotaoAvaliar={!isOwner} />
                    </section>
                </div>
            </div>

            <ModalSobre 
                isOpen={isModalSobreOpen} 
                onClose={() => setIsModalSobreOpen(false)} 
                valorAtual={negocio.description} 
                onSave={(novo: string) => setNegocio((prev: any) => ({ ...prev, description: novo }))} 
            />
            <ModalUpload 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                tipo={uploadType} 
                businessId={negocio.id} 
                onSuccess={(newUrl) => { 
                    const fullUrl = newUrl.startsWith("http") ? newUrl : `http://localhost:5148${newUrl}`;
                    setNegocio((prev: any) => ({ 
                        ...prev, 
                        fotoPerfil: uploadType === "profile" ? fullUrl : prev.fotoPerfil, 
                        fotoCapa: uploadType === "header" ? fullUrl : prev.fotoCapa, 
                        galleryPhotos: uploadType === "galeria" ? [...prev.galleryPhotos, fullUrl] : prev.galleryPhotos 
                    })); 
                }} 
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