"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GaleriaViewerProps {
    fotos: string[];
}

export const GaleriaViewer = ({ fotos }: GaleriaViewerProps) => {
    const [indexAberto, setIndexAberto] = useState<number | null>(null);
    
    // 🌟 CORRIGIDO: Estado interno para as fotos. Assim, podemos remover as que estão quebradas visualmente
    const [fotosValidas, setFotosValidas] = useState<string[]>([]);

    useEffect(() => {
        // Limpa lixos e "zumbis" vazios vindos da API
        const fotosLimpas = fotos.filter(f => 
            f && f.trim() !== "" && f !== "http://localhost:5148" && f !== "http://localhost:5148/"
        );
        setFotosValidas(fotosLimpas);
    }, [fotos]);

    // Função ativada pelo Next.js quando a imagem não é encontrada (404)
    const handleImageError = (fotoQuebrada: string) => {
        setFotosValidas(prev => prev.filter(f => f !== fotoQuebrada));
    };

    // Se o array estiver vazio ou todas as fotos quebrarem, mostra a área vazia
    if (!fotosValidas || fotosValidas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 min-h-[200px] bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-400">Nenhuma foto adicionada.</p>
            </div>
        );
    }

    const MAX_VISIVEIS = 6;
    const fotosVisiveis = fotosValidas.slice(0, MAX_VISIVEIS);
    const fotosRestantes = fotosValidas.length - MAX_VISIVEIS;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (indexAberto !== null && indexAberto < fotosValidas.length - 1) {
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fotosVisiveis.map((foto, idx) => {
                    const isUltimaFotoDaGrade = idx === MAX_VISIVEIS - 1;
                    const temMaisFotos = fotosRestantes > 0;

                    return (
                        <div 
                            key={foto} // Usar a URL como key garante que a remoção não embaralhe a ordem
                            onClick={() => setIndexAberto(idx)}
                            className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer group"
                        >
                            {/* 🌟 MÁGICA AQUI: O onError avisa o estado que a foto quebrou */}
                            <Image 
                                src={foto} 
                                alt={`Foto ${idx + 1}`} 
                                fill 
                                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                unoptimized={true}
                                onError={() => handleImageError(foto)}
                            />
                            
                            {isUltimaFotoDaGrade && temMaisFotos && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-colors group-hover:bg-black/70">
                                    <span className="text-white text-3xl font-bold">+{fotosRestantes}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {indexAberto !== null && indexAberto < fotosValidas.length && (
                <div 
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center backdrop-blur-sm" 
                    onClick={() => setIndexAberto(null)}
                >
                    <button 
                        onClick={() => setIndexAberto(null)} 
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
                    >
                        <X size={36} />
                    </button>

                    {indexAberto > 0 && (
                        <button 
                            onClick={handlePrev} 
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform z-50 bg-black/50 p-3 rounded-full"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}

                    <div className="relative w-full max-w-6xl h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
                        <Image 
                            src={fotosValidas[indexAberto]} 
                            alt={`Foto ampliada ${indexAberto + 1}`} 
                            fill 
                            className="object-contain" 
                            unoptimized={true}
                        />
                    </div>

                    {indexAberto < fotosValidas.length - 1 && (
                        <button 
                            onClick={handleNext} 
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform z-50 bg-black/50 p-3 rounded-full"
                        >
                            <ChevronRight size={32} />
                        </button>
                    )}
                    
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium tracking-widest bg-black/50 px-4 py-1.5 rounded-full">
                        {indexAberto + 1} / {fotosValidas.length}
                    </div>
                </div>
            )}
        </>
    );
};