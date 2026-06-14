"use client";

interface BarraProgressoProps {
    business: any;
}

//  FUNÇÃO DE VALIDAÇÃO RIGOROSA: Impede que o "localhost" puro conte como imagem
const imagemValidaParaPonto = (url?: string) => {
    if (!url || typeof url !== "string") return false;
    const limpa = url.trim();
    return limpa !== "" && limpa !== "http://localhost:5148" && limpa !== "http://localhost:5148/";
};

export const BarraProgressoPerfil = ({ business }: BarraProgressoProps) => {
    if (!business) return null;

    let score = 20; 
    
    if (business.description && business.description.trim() !== "") score += 16;
    if (imagemValidaParaPonto(business.cardImageUrl)) score += 16;
    if (imagemValidaParaPonto(business.businessPhotoUrl)) score += 16;
    if (imagemValidaParaPonto(business.coverPhotoUrl)) score += 16;
    
    if (business.galleryPhotos && business.galleryPhotos.length > 0) score += 16;

    score = Math.min(Math.round(score), 100);

    if (score >= 100) return null; 

    return (
        <div className="bg-white rounded-xl p-5 mt-4 shadow-sm border border-orange-200 animate-in fade-in">
            <div className="flex justify-between items-end mb-3">
                <div>
                    <h3 className="font-bold text-[#0A4F6E] text-sm">Força do seu perfil</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Adicione sua bio e todas as fotos para chegar em 100%!</p>
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