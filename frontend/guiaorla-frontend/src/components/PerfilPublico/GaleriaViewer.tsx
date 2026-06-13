"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GaleriaViewerProps {
    fotos: string[];
}

export const GaleriaViewer = ({ fotos }: GaleriaViewerProps) => {
    // Estado que guarda qual foto está aberta no momento (null = modal fechado)
    const [indexAberto, setIndexAberto] = useState<number | null>(null);

    // Se não tiver fotos, mostra o espaço vazio padronizado
    if (!fotos || fotos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 min-h-[220px] bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-400">Nenhuma foto adicionada.</p>
            </div>
        );
    }

    const MAX_VISIVEIS = 6;
    const fotosVisiveis = fotos.slice(0, MAX_VISIVEIS);
    const fotosRestantes = fotos.length - MAX_VISIVEIS;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (indexAberto !== null && indexAberto < fotos.length - 1) {
            setIndexAberto(indexAberto + 1);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (indexAberto !== null && indexAberto > 0) {
            setIndexAberto(indexAberto - 1);
        }
    };

    return (
        <>
            {/* GRADE DE FOTOS (LIMITADA A 6) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fotosVisiveis.map((foto, idx) => {
                    const isUltimaFotoDaGrade = idx === MAX_VISIVEIS - 1;
                    const temMaisFotos = fotosRestantes > 0;

                    return (
                        <div 
                            key={idx} 
                            onClick={() => setIndexAberto(idx)}
                            className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer group"
                        >
                            <Image 
                                src={foto} 
                                alt={`Foto ${idx + 1}`} 
                                fill 
                                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                unoptimized={true}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                            
                            {/* OVERLAY CINZA + QUANTIDADE DE FOTOS */}
                            {isUltimaFotoDaGrade && temMaisFotos && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-colors group-hover:bg-black/70">
                                    <span className="text-white text-3xl font-bold">+{fotosRestantes}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* MODAL LIGHTBOX (TELA CHEIA) */}
            {indexAberto !== null && (
                <div 
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center backdrop-blur-sm" 
                    onClick={() => setIndexAberto(null)}
                >
                    {/* BOTÃO FECHAR */}
                    <button 
                        onClick={() => setIndexAberto(null)} 
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
                    >
                        <X size={36} />
                    </button>

                    {/* BOTÃO ANTERIOR */}
                    {indexAberto > 0 && (
                        <button 
                            onClick={handlePrev} 
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform z-50 bg-black/50 p-3 rounded-full"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}

                    {/* IMAGEM CENTRAL */}
                    <div className="relative w-full max-w-6xl h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
                        <Image 
                            src={fotos[indexAberto]} 
                            alt={`Foto ampliada ${indexAberto + 1}`} 
                            fill 
                            className="object-contain" 
                            unoptimized={true}
                        />
                    </div>

                    {/* BOTÃO PRÓXIMO */}
                    {indexAberto < fotos.length - 1 && (
                        <button 
                            onClick={handleNext} 
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform z-50 bg-black/50 p-3 rounded-full"
                        >
                            <ChevronRight size={32} />
                        </button>
                    )}
                    
                    {/* CONTADOR DE FOTOS (Ex: 3 / 12) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium tracking-widest bg-black/50 px-4 py-1.5 rounded-full">
                        {indexAberto + 1} / {fotos.length}
                    </div>
                </div>
            )}
        </>
    );
};