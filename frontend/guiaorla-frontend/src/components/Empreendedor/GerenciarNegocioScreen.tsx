"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";

// Importação dos Modais
import { ModalHorario } from "./ModalHorario"; 
import { ModalLocalizacao } from "./ModalLocalizacao";
import { ModalPagamentos } from "./ModalPagamentos";
import { ModalComodidades } from "./ModalComodidades";

import { Clock, CreditCard, MapPin, Settings, ChevronRight } from "lucide-react";

const MenuOption = ({ icon, title, description, onClick }: { 
    icon: React.ReactNode, title: string, description: string, onClick?: () => void 
}) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 group active:scale-[0.99]">
        <div className="flex items-center gap-4 text-left">
            <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-white transition-colors shrink-0">{icon}</div>
            <div>
                <h4 className="font-bold text-[#0A4F6E] text-sm md:text-base">{title}</h4>
                <p className="text-xs md:text-sm text-gray-500 line-clamp-1">{description}</p>
            </div>
        </div>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#0A4F6E] transition-colors shrink-0" />
    </button>
);

export const GerenciarNegocioScreen = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    // ESTADOS DE DADOS
    const [horarioOperacao, setHorarioOperacao] = useState("08:00 às 18:00");
    const [localizacao, setLocalizacao] = useState("Praia de Gaibu, Cabo de Santo Agostinho");
    const [meiosPagamento, setMeiosPagamento] = useState<string[]>(["Pix", "Dinheiro"]);
    const [comodidades, setComodidades] = useState<string[]>(["Wi-fi Grátis", "Pet Friendly"]);
    
    const [activeModal, setActiveModal] = useState<"horario" | "localizacao" | "pagamentos" | "comodidades" | null>(null);

    // Carregar dados salvos ao iniciar
    useEffect(() => {
        const salvo = localStorage.getItem("dadosNegocio");
        if (salvo) {
            const d = JSON.parse(salvo);
            if (d.horario) setHorarioOperacao(d.horario);
            if (d.localizacao) setLocalizacao(d.localizacao);
            if (d.pagamentos) setMeiosPagamento(d.pagamentos);
            if (d.comodidades) setComodidades(d.comodidades);
        }
    }, []);

    // Função central para persistir mudanças
    const atualizarEPersistir = (campo: string, valor: any) => {
        const dadosAtuais = JSON.parse(localStorage.getItem("dadosNegocio") || "{}");
        const novosDados = {
            ...dadosAtuais,
            horario: campo === "horario" ? valor : horarioOperacao,
            localizacao: campo === "localizacao" ? valor : localizacao,
            pagamentos: campo === "pagamentos" ? valor : meiosPagamento,
            comodidades: campo === "comodidades" ? valor : comodidades,
        };
        localStorage.setItem("dadosNegocio", JSON.stringify(novosDados));
    };

    const handleCategoryClick = (cat: string) => router.push(`/empreendedor/explorer?categoria=${encodeURIComponent(cat)}`);
    
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
            <HeaderListagem isEmpreendedor={true} forceBlue={true} scrolled={true} categoriaAtiva="" setCategoriaAtiva={handleCategoryClick} showFilter={false} setIsFilterOpen={() => {}} navRef={navRef} handleMouseDown={handleMouseDown} />
            <div className="h-20"></div>

            <div className="max-w-[800px] mx-auto px-4">
                <h2 className="text-2xl font-bold text-[#0A4F6E] mb-6 tracking-tight">Gerenciar meu Negócio</h2>

                <div className="flex flex-col gap-4">
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operação</span></div>
                        <MenuOption icon={<Clock className="text-[#FF7620]" />} title="Horário de Funcionamento" description={horarioOperacao} onClick={() => setActiveModal("horario")} />
                        <MenuOption icon={<MapPin className="text-[#FF7620]" />} title="Localização Exata" description={localizacao} onClick={() => setActiveModal("localizacao")} />
                    </section>

                    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Serviços e Filtros</span></div>
                        <MenuOption icon={<CreditCard className="text-[#1398D4]" />} title="Meios de Pagamento" description={meiosPagamento.join(", ")} onClick={() => setActiveModal("pagamentos")} />
                        <MenuOption icon={<Settings className="text-[#1398D4]" />} title="Comodidades (Filtros)" description={comodidades.join(", ")} onClick={() => setActiveModal("comodidades")} />
                    </section>
                </div>
            </div>

            <ModalHorario 
    isOpen={activeModal === "horario"} 
    onClose={() => setActiveModal(null)} 
    valorAtual={horarioOperacao} // Passando o valor atual para o modal
    onSave={(v) => { 
        setHorarioOperacao(v); 
        atualizarEPersistir("horario", v); 
    }} 
/>
            <ModalLocalizacao isOpen={activeModal === "localizacao"} onClose={() => setActiveModal(null)} onSave={(l: any) => { setLocalizacao(l.endereco); atualizarEPersistir("localizacao", l.endereco); }} />
            <ModalPagamentos isOpen={activeModal === "pagamentos"} onClose={() => setActiveModal(null)} pagamentosAtuais={meiosPagamento} onSave={(v) => { setMeiosPagamento(v); atualizarEPersistir("pagamentos", v); }} />
            <ModalComodidades isOpen={activeModal === "comodidades"} onClose={() => setActiveModal(null)} comodidadesAtuais={comodidades} onSave={(v) => { setComodidades(v); atualizarEPersistir("comodidades", v); }} />
        </main>
    );
};