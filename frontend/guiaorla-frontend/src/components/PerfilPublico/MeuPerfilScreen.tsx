"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { PerfilHeader } from "@/components/PerfilPublico/PerfilHeader";
import { ModalUpload } from "./ModalUpload";
import { ModalSobre } from "./ModalSobre";
import { SecaoFeedback } from "@/components/PerfilPublico/SecaoFeedback";
import { Clock, MapPin, CreditCard, Sparkles, Store, Loader2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

import { GaleriaViewer } from "./GaleriaViewer"; 

import { BarraProgressoPerfil } from "@/components/Empreendedor/BarraProgressoPerfil";

import { atualizarNegocio } from "@/services/businessService";

interface BusinessData {
    id: string;
    name: string;
    serviceType: number;
    address: string;
    horario: string;
    cartao: boolean;
    pix: boolean;
    dinheiro: boolean;
    chuveiro: boolean;
    estacionamento: boolean;
    cadeira: boolean;
    petFriendly: boolean;
    acessibilidade: boolean;
    wifi: boolean;
    businessPhotoUrl: string;
    coverPhotoUrl: string; 
    cardImageUrl: string;
    description: string;
    galleryPhotos: string[];
    nota: number;
    totalAvaliacoes: number;
    latitude?: number;  
    longitude?: number;
}

export const MeuPerfilScreen = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [scrolled, setScrolled] = useState(false);
    const [business, setBusiness] = useState<BusinessData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalSobreOpen, setIsModalSobreOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState<"galeria" | "header" | "profile" | "card">("galeria");
    
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<"header" | "profile" | "card" | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [isSavingDesc, setIsSavingDesc] = useState(false);

    const [indexAberto, setIndexAberto] = useState<number | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const getCategoriaTexto = (type: number) => {
        const categories = ["Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"];
        return categories[type] || "Não Categorizado";
    };

    const getPagamentosLista = (b: BusinessData) => {
        const list = [];
        if (b.pix) list.push("Pix");
        if (b.cartao) list.push("Cartão");
        if (b.dinheiro) list.push("Dinheiro");
        return list.length > 0 ? list : ["Não informado"];
    };

    const getComodidadesLista = (b: BusinessData) => {
        const list = [];
        if (b.chuveiro) list.push("Chuveirão");
        if (b.estacionamento) list.push("Estacionamento");
        if (b.cadeira) list.push("Cadeira de Sol");
        if (b.petFriendly) list.push("Pet Friendly");
        if (b.acessibilidade) list.push("Acessibilidade");
        if (b.wifi) list.push("Wi-Fi Grátis");
        return list.length > 0 ? list : ["Nenhuma comodidade informada"];
    };

    const handleImageUpdate = (newUrl: string) => {
        const fullUrl = newUrl.startsWith("http") ? newUrl : `http://localhost:5148${newUrl}`;
        setBusiness(prev => {
            if (!prev) return null;
            if (uploadType === "profile") return { ...prev, businessPhotoUrl: fullUrl };
            if (uploadType === "header") return { ...prev, coverPhotoUrl: fullUrl };
            if (uploadType === "card") return { ...prev, cardImageUrl: fullUrl }; 
            if (uploadType === "galeria") {
                const galeriaAtualizada = prev.galleryPhotos.includes(fullUrl)
                    ? prev.galleryPhotos
                    : [...prev.galleryPhotos, fullUrl];
                return { ...prev, galleryPhotos: galeriaAtualizada };
            }
            return prev;
        });
        setIsUploadModalOpen(false);
    };

    const handleSaveDescricao = async (novaDescricao: string) => {
        if (!business) return;
        setIsSavingDesc(true);
        
        try {
            const token = (session as any).accessToken || (session as any).token;
            
            const payload = {
                name: business.name,
                serviceType: business.serviceType,
                address: business.address,
                horario: business.horario,
                cartao: business.cartao,
                pix: business.pix,
                dinheiro: business.dinheiro,
                chuveiro: business.chuveiro,
                estacionamento: business.estacionamento,
                cadeira: business.cadeira,
                petFriendly: business.petFriendly,
                acessibilidade: business.acessibilidade,
                wifi: business.wifi,
                description: novaDescricao, 
                coverPhotoUrl: business.coverPhotoUrl.replace("http://localhost:5148", ""),
                businessPhotoUrl: business.businessPhotoUrl.replace("http://localhost:5148", ""),
                cardImageUrl: business.cardImageUrl.replace("http://localhost:5148", ""),
                latitude: business.latitude || 0,
                longitude: business.longitude || 0,
                galleryPhotos: business.galleryPhotos.map(url => url.replace("http://localhost:5148", ""))
            };

            await atualizarNegocio(business.id, payload, token);
            
            setBusiness(prev => prev ? { ...prev, description: novaDescricao } : null);
            setIsModalSobreOpen(false);
            
        } catch (error) {
            alert("Não foi possível salvar a descrição. Tente novamente.");
        } finally {
            setIsSavingDesc(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!business || !deleteType) return;
        
        try {
            setIsDeleting(true);
            const token = (session as any).accessToken || (session as any).token;

            const response = await fetch(`http://localhost:5148/api/business/${business.id}/photo?type=${deleteType}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setBusiness(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        coverPhotoUrl: deleteType === "header" ? "" : prev.coverPhotoUrl,
                        businessPhotoUrl: deleteType === "profile" ? "" : prev.businessPhotoUrl,
                        cardImageUrl: deleteType === "card" ? "" : prev.cardImageUrl
                    };
                });
                setIsConfirmDeleteOpen(false);
                setDeleteType(null);
            } else {
                console.error("Falha ao deletar a imagem no servidor");
            }
        } catch (error) {
            console.error("Erro de rede ao tentar deletar a imagem:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteGalleryPhotos = async (urlsToDelete: string[]) => {
        if (!business) return;
        try {
            const token = (session as any).accessToken || (session as any).token;
            const response = await fetch(`http://localhost:5148/api/business/${business.id}/photo/gallery`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ urls: urlsToDelete })
            });

            if (response.ok) {
                setBusiness(prev => {
                    if (!prev) return prev;
                    return { ...prev, galleryPhotos: prev.galleryPhotos.filter(foto => !urlsToDelete.includes(foto)) };
                });
            }
        } catch (error) { console.error("Erro de rede ao deletar da galeria:", error); }
    };

    const handleOpenDelete = (tipo: "header" | "profile" | "card") => {
        setDeleteType(tipo);
        setIsConfirmDeleteOpen(true);
    };

    useEffect(() => {
        const carregarDadosDono = async () => {
            if (status === "loading" || !session) return;
            try {
                setIsLoading(true);
                const token = (session as any).accessToken || (session as any).token;

                const response = await fetch(`http://localhost:5148/api/business/user?t=${new Date().getTime()}`, {
                    method: "GET", cache: "no-store",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
                });

                if (response.ok) {
                    const d = await response.json();
                    setBusiness({
                        id: d.id ?? d.Id,
                        name: d.name ?? d.Name ?? "",
                        serviceType: d.serviceType ?? d.ServiceType ?? 0,
                        address: d.address ?? d.Address ?? "",
                        horario: d.horario ?? d.Horario ?? "08:00 às 18:00",
                        cartao: !!(d.cartao ?? d.Cartao),
                        pix: !!(d.pix ?? d.Pix),
                        dinheiro: !!(d.dinheiro ?? d.Dinheiro),
                        chuveiro: !!(d.chuveiro ?? d.Chuveiro),
                        estacionamento: !!(d.estacionamento ?? d.Estacionamento),
                        cadeira: !!(d.cadeira ?? d.Cadeira),
                        petFriendly: !!(d.petFriendly ?? d.PetFriendly),
                        acessibilidade: !!(d.acessibilidade ?? d.Acessibilidade),
                        wifi: d.wifi === true || d.Wifi === true,
                        businessPhotoUrl: (d.businessPhotoUrl ?? d.BusinessPhotoUrl) ? `http://localhost:5148${d.businessPhotoUrl ?? d.BusinessPhotoUrl}` : "",
                        coverPhotoUrl: (d.coverPhotoUrl ?? d.CoverPhotoUrl) ? `http://localhost:5148${d.coverPhotoUrl ?? d.CoverPhotoUrl}` : "",
                        cardImageUrl: (d.cardImageUrl ?? d.CardImageUrl) ? `http://localhost:5148${d.cardImageUrl ?? d.CardImageUrl}` : "",
                        description: d.description ?? d.Description ?? "",
                        galleryPhotos: (d.galleryPhotos ?? d.GalleryPhotos ?? []).map((p: string) => p.startsWith("http") ? p : `http://localhost:5148${p}`),
                        nota: 5.0,
                        totalAvaliacoes: 0,
                        latitude: d.latitude || d.Latitude, 
                        longitude: d.longitude || d.Longitude 
                    });
                }
            } catch (error) { console.error("Erro:", error); } finally { setIsLoading(false); }
        };
        carregarDadosDono();
    }, [session, status]);

    useEffect(() => { document.body.style.overflow = "auto"; window.scrollTo(0, 0); }, []);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCategoryClick = (cat: string) => { router.push(`/empreendedor/explorer?categoria=${encodeURIComponent(cat)}`); };
    const handleOpenUpload = (tipo: "galeria" | "header" | "profile" | "card") => { setUploadType(tipo); setIsUploadModalOpen(true); };

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

    if (isLoading || !business) return <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]"><Loader2 className="animate-spin text-[#0A4F6E]" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#F0F2F5] font-sans pb-20 text-left">
            <HeaderListagem isEmpreendedor={true} forceBlue={true} scrolled={scrolled} categoriaAtiva="" setCategoriaAtiva={handleCategoryClick} showFilter={false} setIsFilterOpen={() => { }} navRef={navRef} handleMouseDown={handleMouseDown} />
            <div className="h-16"></div>

            <div className="max-w-[1100px] mx-auto">
                <PerfilHeader
                    key={`${business.businessPhotoUrl}-${business.coverPhotoUrl}`} 
                    podeEditar={true}
                    onEditCover={() => handleOpenUpload("header")}
                    onEditProfile={() => handleOpenUpload("profile")}
                    onDeleteCover={() => handleOpenDelete("header")}
                    onDeleteProfile={() => handleOpenDelete("profile")}
                    nomeNegocio={business.name}
                    fotoCapa={business.coverPhotoUrl} 
                    fotoPerfil={business.businessPhotoUrl}
                    localizacao={business.address}
                />

                <BarraProgressoPerfil business={business} /> 

                <div className="px-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 mt-4">
                    <aside className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-[#0A4F6E] text-lg">Sobre meu Negócio</h3>
                                <button onClick={() => setIsModalSobreOpen(true)} className="text-xs font-bold text-[#1398D4] hover:underline">Editar Bio</button>
                            </div>
                            {/* ATUALIZAÇÃO: Classe break-words para palavras muito longas não quebrarem o layout */}
                            <p className="text-gray-600 text-sm leading-relaxed font-medium break-words">
                                {business.description || "Nenhuma descrição adicionada."}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[#0A4F6E] text-lg">Foto da Vitrine</h3>
                                <div className="flex items-center gap-3">
                                    {business.cardImageUrl && (
                                        <button onClick={() => handleOpenDelete("card")} className="text-xs font-bold text-red-500 hover:underline">
                                            Remover
                                        </button>
                                    )}
                                    <button onClick={() => handleOpenUpload("card")} className="text-xs font-bold text-[#1398D4] hover:underline">
                                        {business.cardImageUrl ? "Alterar" : "Adicionar"}
                                    </button>
                                </div>
                            </div>
                            <div className="relative aspect-[4/3] w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200 group cursor-pointer" onClick={() => handleOpenUpload("card")}>
                                {business.cardImageUrl ? (
                                    <Image src={business.cardImageUrl} alt="Vitrine" fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 p-4 text-center group-hover:text-[#1398D4] transition-colors">
                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                        <span className="text-xs font-medium">Nenhuma foto adicionada</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-3 text-center leading-tight">Esta é a foto principal que os clientes verão nas buscas da Orla.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-5">
                            <h3 className="font-bold text-[#0A4F6E] text-lg">Dados Operacionais</h3>
                            <InfoRow icon={<Store size={18} className="text-[#FF7620]" />} label="Categoria" value={getCategoriaTexto(business.serviceType)} />
                            <InfoRow icon={<Clock size={18} className="text-[#1398D4]" />} label="Seu Horário" value={business.horario} />
                            <InfoRow icon={<MapPin size={18} className="text-[#1398D4]" />} label="Sua Localização" value={business.address} />
                            <InfoRow icon={<CreditCard size={18} className="text-[#1398D4]" />} label="Seus Pagamentos" value={getPagamentosLista(business).join(", ")} />
                            <InfoRow icon={<Sparkles size={18} className="text-[#1398D4]" />} label="Suas Comodidades" value={getComodidadesLista(business).join(" • ")} />
                        </div>
                    </aside>

                    <section className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[300px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0A4F6E] text-xl italic">Minha Galeria</h3>
                                <button onClick={() => handleOpenUpload("galeria")} className="text-sm font-bold text-[#1398D4] hover:underline">+ Adicionar Fotos</button>
                            </div>
                            <GaleriaViewer fotos={business.galleryPhotos} podeEditar={true} onDeleteMultiple={handleDeleteGalleryPhotos} />
                        </div>
                        <SecaoFeedback nota={business.nota} totalAvaliacoes={business.totalAvaliacoes} exibirBotaoAvaliar={false} />
                    </section>
                </div>
            </div>

            <ModalSobre 
                isOpen={isModalSobreOpen} 
                onClose={() => setIsModalSobreOpen(false)} 
                valorAtual={business.description} 
                onSave={handleSaveDescricao} 
                isSaving={isSavingDesc} 
            />
            
            <ModalUpload isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} tipo={uploadType} businessId={business.id} onSuccess={handleImageUpdate} />
            
            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => !isDeleting && setIsConfirmDeleteOpen(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#0A4F6E] mb-2">Confirmar Exclusão</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Tem certeza que deseja remover permanentemente a {deleteType === "header" ? "foto de capa" : deleteType === "profile" ? "foto de perfil" : "foto da vitrine"}?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setIsConfirmDeleteOpen(false)} disabled={isDeleting} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50">Cancelar</button>
                            <button onClick={handleConfirmDelete} disabled={isDeleting} className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center min-w-[90px] disabled:opacity-70">
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Sim, excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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