"use client";

import { API_URL } from "@/lib/config";

interface BarraProgressoProps {
    business: any;
}

//  FUNÇÃO DE VALIDAÇÃO RIGOROSA: Impede que o "localhost" puro conte como imagem
const imagemValidaParaPonto = (url?: string) => {
    if (!url || typeof url !== "string") return false;
    const limpa = url.trim();
    return (
    limpa !== "" &&
    limpa !== API_URL &&
    limpa !== `${API_URL}/`
)
};

export const BarraProgressoPerfil = ({ business }: BarraProgressoProps) => {
    if (!business) return null;

    // Critérios de preenchimento:
    // 1. Descrição, Vitrine, Perfil, Capa, Galeria (5 itens)
    // 2. Endereço, Categoria, Horário, Comodidades (4 itens)
    const criterios = [
        !!(business.description && business.description.trim() !== ""),
        imagemValidaParaPonto(business.cardImageUrl),
        imagemValidaParaPonto(business.businessPhotoUrl),
        imagemValidaParaPonto(business.coverPhotoUrl),
        !!(business.galleryPhotos && business.galleryPhotos.length > 0),
        !!(business.address && business.address.trim() !== ""),
        business.serviceType > 0,
        !!(business.horario && business.horario.trim() !== ""),
        // Verifica se há pelo menos um item de comodidade/pagamento
        !!(business.pix || business.cartao || business.dinheiro || business.wifi || business.estacionamento)
    ];

    const totalCrit = criterios.length;
    const feitos = criterios.filter(c => c).length;
    const score = Math.round((feitos / totalCrit) * 100);

    if (score >= 100) return null; 

    return (
        // ... (seu JSX original permanece igual, o score dinâmico vai cuidar da barra)
        <div className="bg-white rounded-xl p-5 mt-4 shadow-sm border border-orange-200 animate-in fade-in">
            <div className="flex justify-between items-end mb-3">
                <div>
                    <h3 className="font-bold text-[#0A4F6E] text-sm">Força do seu perfil</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Complete todas as informações para destacar seu negócio!</p>
                </div>
                <span className="font-bold text-[#FF7620] text-xl">{score}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-[#FF904B] to-[#FF7620] h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
};