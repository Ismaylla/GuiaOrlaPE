"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react"; // IMPORTADO: Para controle de acesso
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { PerfilHeader } from "@/components/PerfilPublico/PerfilHeader";
import { SecaoFeedback } from "@/components/PerfilPublico/SecaoFeedback";
import { Clock, MapPin, CreditCard, Sparkles, Star } from "lucide-react";
import { buscarNegocioPorId, listarAvaliacoesDoNegocio } from "@/services/businessService";

interface PerfilPublicoScreenProps {
    isEmpreendedor: boolean;
}

export const PerfilPublicoScreen = ({ isEmpreendedor }: PerfilPublicoScreenProps) => {
    const router = useRouter();
    const { data: session } = useSession(); // Captura a sessão ativa do usuário logado
    const params = useParams(); 
    const idNegocio = params?.id as string;

    const [scrolled, setScrolled] = useState(false);
    const [negocio, setNegocio] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    const navRef = useRef<HTMLDivElement>(null);

    // Recupera o ID do usuário logado de forma flexível dependendo do formato do JWT
    const usuarioLogadoId = (session as any)?.user?.id || (session as any)?.id;

    // LÓGICA DE DONO (isOwner): Valida se o negócio pertence a quem está visualizando
    const isOwner = !!(session && negocio && negocio.userId === usuarioLogadoId);

    useEffect(() => {
        const carregarPerfil = async () => {
            if (!idNegocio) return;
            try {
                setCarregando(true);
                setErro(false);

                // 1. Faz as duas chamadas paralelas para a API C#
                const dados = await buscarNegocioPorId(idNegocio);
                const avaliacoes = await listarAvaliacoesDoNegocio(idNegocio);

                // 2. Calcula a média e o total de avaliações dinamicamente baseando-se no banco
                const total = avaliacoes.length;
                const media = total > 0 
                    ? avaliacoes.reduce((acc: number, item: any) => acc + item.stars, 0) / total 
                    : 0.0;

                // 3. Mapeamento dinâmico de pagamentos (Ajuste de UI Real)
                const pagamentosLista: string[] = [];
                if (dados.pix ?? dados.Pix) pagamentosLista.push("Pix");
                if (dados.cartao ?? dados.Cartao) pagamentosLista.push("Cartão");
                if (dados.dinheiro ?? dados.Dinheiro) pagamentosLista.push("Dinheiro");

                // 4. Mapeamento dinâmico de comodidades incluindo o campo Wi-Fi
                const comodidadesLista: string[] = [];
                if (dados.chuveiro ?? dados.Chuveiro) comodidadesLista.push("Chuveirão");
                if (dados.estacionamento ?? dados.Estacionamento) comodidadesLista.push("Estacionamento");
                if (dados.cadeira ?? dados.Cadeira) comodidadesLista.push("Cadeira de Sol");
                if (dados.petFriendly ?? dados.PetFriendly) comodidadesLista.push("Pet Friendly");
                if (dados.acessibilidade ?? dados.Acessibilidade) comodidadesLista.push("Acessibilidade");
                if (dados.wifi ?? dados.Wifi) comodidadesLista.push("Wi-Fi Grátis"); // Campo adicionado!

                setNegocio({
                    id: dados.id ?? dados.Id,
                    userId: dados.userId ?? dados.UserId, // Guardado para fazer a checagem do isOwner
                    nome: dados.name || "Sem Nome",
                    localizacao: dados.address || "Endereço não informado",
                    horario: dados.horario || dados.Horario || "Horário não informado", // Agora vem do banco!
                    pagamentos: pagamentosLista.length > 0 ? pagamentosLista : ["Não informado"],
                    comodidades: comodidadesLista.length > 0 ? comodidadesLista : ["Nenhuma comodidade informada"],
                    nota: media, 
                    totalAvaliacoes: total, 
                    fotoCapa: dados.businessPhotoUrl || "/images/capa-exemplo.jpg"
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
                <div className="w-10 h-10 border-4 border-[#0A4F6E] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 italic text-sm">Carregando dados do perfil...</p>
            </div>
        );
    }

    if (erro || !negocio) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-md border border-red-100 text-center max-w-md">
                    <p className="text-red-600 font-bold">Perfil não encontrado</p>
                    <p className="text-gray-500 text-xs mt-2 mb-4">Verifique se o ID do comércio existe no seu PostgreSQL local.</p>
                    <button onClick={() => router.back()} className="px-4 py-2 bg-[#0A4F6E] text-white rounded-xl text-xs font-bold">Voltar</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen h-full bg-[#F0F2F5] font-sans pb-20 text-left">
            <HeaderListagem
                isEmpreendedor={isEmpreendedor}
                forceBlue={true}
                scrolled={scrolled}
                categoriaAtiva=""
                setCategoriaAtiva={handleCategoryClick}
                showFilter={false}
                setIsFilterOpen={() => { }}
                navRef={navRef}
                handleMouseDown={handleMouseDown}
            />

            <div className="h-16"></div>

            <div className="max-w-[1100px] mx-auto">
                {/* ALTERAÇÃO DA ETAPA 4: podeEditar agora recebe a validação em tempo real de dono */}
                <PerfilHeader 
                    podeEditar={isOwner} 
                    nomeNegocio={negocio.nome} 
                    fotoCapa={negocio.fotoCapa} 
                    localizacao={negocio.localizacao}
                />

                <div className="px-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 mt-4">
                    <aside className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-[#0A4F6E] text-lg">Sobre</h3>
                                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                                    <span className="text-[#FF7620] font-bold text-sm">{negocio.nota.toFixed(1)}</span>
                                    <Star size={12} className="text-[#FF7620] fill-[#FF7620]" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                <span className="font-bold text-[#0A4F6E]">{negocio.nome}:</span> Venha conhecer nosso espaço na orla! Oferecemos uma ótima experiência gastronômica e de lazer na praia.
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
                            <h3 className="font-bold text-[#0A4F6E] text-xl italic mb-6">Galeria de Fotos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200"></div>
                                <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
                            </div>
                        </div>

                        <SecaoFeedback
                            nota={negocio.nota}
                            totalAvaliacoes={negocio.totalAvaliacoes}
                            exibirBotaoAvaliar={!isOwner} // ALTERAÇÃO: Dono não pode avaliar o próprio estabelecimento
                        />
                    </section>
                </div>
            </div>
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