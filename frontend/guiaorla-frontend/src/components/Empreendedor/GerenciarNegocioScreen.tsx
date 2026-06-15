
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";

import { ModalHorario } from "./ModalHorario"; 
import { ModalLocalizacao } from "./ModalLocalizacao";
import { ModalPagamentos } from "./ModalPagamentos";
import { ModalComodidades } from "./ModalComodidades";
import { ModalCategoria } from "./ModalCategoria"; 

import { Clock, CreditCard, MapPin, Settings, ChevronRight, Store, Loader2 } from "lucide-react";

interface BusinessData {
    id?: string;
    name: string;
    serviceType: number; 
    address: string;
    latitude: number;
    longitude: number;
    businessPhotoUrl?: string;
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
}

// CORRIGIDO: Tipo alterado de React.RefNode para React.ReactNode
const MenuOption = ({ icon, title, description, onClick }: { 
    icon: React.ReactNode, title: string, description: string, onClick?: () => void 
}) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 group active:scale-[0.99]">
        <div className="flex items-center gap-4 text-left">
            <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-white transition-colors shrink-0">{icon}</div>
            <div>
                <h4 className="font-bold text-[#0A4F6E] text-sm md:text-base">{title}</h4>
                <p className="text-xs md:text-sm text-gray-500 line-clamp-1">{description || "Clique para definir"}</p>
            </div>
        </div>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#0A4F6E] transition-colors shrink-0" />
    </button>
);

export const GerenciarNegocioScreen = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const [business, setBusiness] = useState<BusinessData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModal, setActiveModal] = useState<"horario" | "localizacao" | "pagamentos" | "comodidades" | "categoria" | null>(null);

    const getPagamentosTexto = (b: BusinessData) => {
        const list = [];
        if (b.pix) list.push("Pix");
        if (b.cartao) list.push("Cartão");
        if (b.dinheiro) list.push("Dinheiro");
        return list.length > 0 ? list.join(", ") : "Nenhum selecionado";
    };

    const getComodidadesTexto = (b: BusinessData) => {
        const list = [];
        if (b.chuveiro) list.push("Ducha/Chuveiro");
        if (b.estacionamento) list.push("Estacionamento");
        if (b.cadeira) list.push("Guarda-sol");
        if (b.petFriendly) list.push("Pet Friendly");
        if (b.acessibilidade) list.push("Acessibilidade");
        if (b.wifi) list.push("Wi-fi Grátis");
        return list.length > 0 ? list.join(", ") : "Nenhuma selecionada";
    };

    //  CORRIGIDO: Alinhado com o BusinessServiceTypeEnum do C# (Índices de 1 a 5)
    const getCategoriaTexto = (type: number) => {
        const map: Record<number, string> = {
            1: "Barracas e Ambulantes",
            2: "Passeios e Lazer",
            3: "Bares e Restaurantes",
            4: "Artesanato Local",
            5: "Comércio e Serviços"
        };
        return map[type] || "Não Categorizado";
    };

    useEffect(() => {
        const carregarDadosNegocio = async () => {
            if (status === "loading" || !session) return;
            try {
                setIsLoading(true);
                const token = (session as any).accessToken || (session as any).token;
                
                const response = await fetch(`http://localhost:5148/api/business/user?t=${new Date().getTime()}`, {
                    method: "GET",
                    cache: "no-store",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
                });

                if (response.ok) {
                    const d = await response.json();

                    setBusiness({
                        id: d.id ?? d.Id,
                        name: d.name ?? d.Name ?? "",
                        serviceType: d.serviceType ?? d.ServiceType ?? 0,
                        address: d.address ?? d.Address ?? "",
                        latitude: d.latitude ?? d.Latitude ?? 0,
                        longitude: d.longitude ?? d.Longitude ?? 0,
                        businessPhotoUrl: d.businessPhotoUrl ?? d.BusinessPhotoUrl,
                        horario: d.horario ?? d.Horario ?? "", 
                        cartao: !!(d.cartao ?? d.Cartao),
                        pix: !!(d.pix ?? d.Pix),
                        dinheiro: !!(d.dinheiro ?? d.Dinheiro),
                        chuveiro: !!(d.chuveiro ?? d.Chuveiro),
                        estacionamento: !!(d.estacionamento ?? d.Estacionamento),
                        cadeira: !!(d.cadeira ?? d.Cadeira),
                        petFriendly: !!(d.petFriendly ?? d.PetFriendly),
                        acessibilidade: !!(d.acessibilidade ?? d.Acessibilidade),
                        wifi: d.wifi === true || d.Wifi === true,
                    });
                }
            } catch (error) { console.error(error); } finally { setIsLoading(false); }
        };
        carregarDadosNegocio();
    }, [session, status, router]);

    const atualizarEPersistir = async (novasPropriedades: Partial<BusinessData>) => {
        if (!business || !session) return;
        const token = (session as any).accessToken || (session as any).token;
        const estadoFinal = { ...business, ...novasPropriedades };
        
        const payload = {
            ...estadoFinal,
            Cartao: !!estadoFinal.cartao,
            Pix: !!estadoFinal.pix,
            Dinheiro: !!estadoFinal.dinheiro,
            Chuveiro: !!estadoFinal.chuveiro,
            Estacionamento: !!estadoFinal.estacionamento,
            Cadeira: !!estadoFinal.cadeira,
            PetFriendly: !!estadoFinal.petFriendly,
            Acessibilidade: !!estadoFinal.acessibilidade,
            Wifi: !!estadoFinal.wifi,
        };

        try {
            const response = await fetch(`http://localhost:5148/api/business/${business.id}`, { 
                method: 'PUT',
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload) 
            });

            if (response.ok) {
                setBusiness(estadoFinal);
                setActiveModal(null);
            } else {
                alert("Erro ao salvar no banco.");
            }
        } catch (error) { console.error(error); }
    };

    const handleCategoryClick = (cat: string) => router.push(`/empreendedor/explorer?categoria=${encodeURIComponent(cat)}`);
    const handleMouseDown = (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => {
        if (!ref.current || ref.current.scrollWidth <= ref.current.clientWidth) return;
        const ele = ref.current; const startX = e.pageX - ele.offsetLeft; const scrollLeft = ele.scrollLeft;
        const handleMouseMove = (le: MouseEvent) => { const x = le.pageX - ele.offsetLeft; const walk = (x - startX) * 2; ele.scrollLeft = scrollLeft - walk; };
        const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
        document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
    };

    if (isLoading || !business) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
            <HeaderListagem isEmpreendedor={true} forceBlue={true} scrolled={true} categoriaAtiva="" setCategoriaAtiva={handleCategoryClick} showFilter={false} setIsFilterOpen={() => {}} navRef={navRef} handleMouseDown={handleMouseDown} />
            <div className="h-20"></div>

            <div className="max-w-[800px] mx-auto px-4">
                <h2 className="text-2xl font-bold text-[#0A4F6E] mb-6">Gerenciar meu Negócio</h2>
                <div className="flex flex-col gap-4">
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50/50"><span className="text-xs font-bold text-gray-400 uppercase">Operação</span></div>
                        <MenuOption icon={<Store className="text-[#FF7620]" />} title="Categoria" description={getCategoriaTexto(business.serviceType)} onClick={() => setActiveModal("categoria")} />
                        <MenuOption icon={<Clock className="text-[#FF7620]" />} title="Horário" description={business.horario} onClick={() => setActiveModal("horario")} />
                        <MenuOption icon={<MapPin className="text-[#FF7620]" />} title="Localização" description={business.address} onClick={() => setActiveModal("localizacao")} />
                    </section>
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50/50"><span className="text-xs font-bold text-gray-400 uppercase">Serviços</span></div>
                        <MenuOption icon={<CreditCard className="text-[#1398D4]" />} title="Pagamento" description={getPagamentosTexto(business)} onClick={() => setActiveModal("pagamentos")} />
                        <MenuOption icon={<Settings className="text-[#1398D4]" />} title="Comodidades" description={getComodidadesTexto(business)} onClick={() => setActiveModal("comodidades")} />
                    </section>
                </div>
            </div>

            <ModalCategoria 
                isOpen={activeModal === "categoria"} 
                categoriaAtual={getCategoriaTexto(business.serviceType)} 
                onClose={() => setActiveModal(null)} 
                onSave={(v) => {
                    //  CORRIGIDO: Alinhado com o BusinessServiceTypeEnum do C# (Índices de 1 a 5)
                    const map: Record<string, number> = { 
                        "Barracas e Ambulantes": 1, 
                        "Passeios e Lazer": 2, 
                        "Bares e Restaurantes": 3, 
                        "Artesanato Local": 4, 
                        "Comércio e Serviços": 5 
                    };
                    atualizarEPersistir({ serviceType: map[v] ?? 1 });
                }} 
            />
            <ModalHorario isOpen={activeModal === "horario"} onClose={() => setActiveModal(null)} valorAtual={business.horario} onSave={(v) => atualizarEPersistir({ horario: v })} />
            <ModalLocalizacao isOpen={activeModal === "localizacao"} onClose={() => setActiveModal(null)} enderecoAtual={business.address} latitudeAtual={business.latitude} longitudeAtual={business.longitude} onSave={(l: any) => atualizarEPersistir({ address: l.endereco, latitude: l.coords.lat, longitude: l.coords.lng })} />
            
            <ModalPagamentos 
                isOpen={activeModal === "pagamentos"} 
                onClose={() => setActiveModal(null)} 
                pagamentosAtuais={[...(business.pix ? ["Pix"] : []), ...(business.cartao ? ["Cartão"] : []), ...(business.dinheiro ? ["Dinheiro"] : [])]} 
                onSave={(v) => atualizarEPersistir({ pix: v.includes("Pix"), cartao: v.includes("Cartão"), dinheiro: v.includes("Dinheiro") })} 
            />
            
            <ModalComodidades isOpen={activeModal === "comodidades"} onClose={() => setActiveModal(null)} comodidadesAtuais={[...(business.chuveiro ? ["Ducha/Chuveiro"] : []), ...(business.estacionamento ? ["Estacionamento"] : []), ...(business.cadeira ? ["Guarda-sol"] : []), ...(business.petFriendly ? ["Pet Friendly"] : []), ...(business.acessibilidade ? ["Acessibilidade"] : []), ...(business.wifi ? ["Wi-fi Grátis"] : [])]} onSave={(v) => atualizarEPersistir({ chuveiro: v.includes("Ducha/Chuveiro"), estacionamento: v.includes("Estacionamento"), cadeira: v.includes("Guarda-sol"), petFriendly: v.includes("Pet Friendly"), acessibilidade: v.includes("Acessibilidade"), wifi: v.includes("Wi-fi Grátis") })} />
        </main>
    );
};