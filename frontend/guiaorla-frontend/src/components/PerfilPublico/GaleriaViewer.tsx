"use client";

import { API_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Trash2, Edit2, CheckCircle2, Circle } from "lucide-react";

interface GaleriaViewerProps {
    fotos: string[];
    podeEditar?: boolean;
    onDeleteMultiple?: (urls: string[]) => void; // Função para excluir várias
}

export const GaleriaViewer = ({ fotos, podeEditar = false, onDeleteMultiple }: GaleriaViewerProps) => {
    const [indexAberto, setIndexAberto] = useState<number | null>(null);
    const [fotosValidas, setFotosValidas] = useState<string[]>([]);
    
    // ESTADOS DO MODO DE EDIÇÃO
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

    useEffect(() => {
        const fotosLimpas = fotos.filter(f => 
            f && f.trim() !== "" && f !== `${API_URL}` && f !== `${API_URL}/`
        );
        setFotosValidas(fotosLimpas);
        
        // Se a galeria ficar vazia, sai do modo de edição
        if (fotosLimpas.length === 0) {
            setIsEditing(false);
            setSelectedUrls([]);
        }
    }, [fotos]);

    const handleImageError = (fotoQuebrada: string) => {
        setFotosValidas(prev => prev.filter(f => f !== fotoQuebrada));
        setSelectedUrls(prev => prev.filter(f => f !== fotoQuebrada));
    };

    // Alterna a seleção da imagem
    const toggleSelection = (url: string) => {
        setSelectedUrls(prev => 
            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
        );
    };

    const handleConfirmDelete = () => {
        if (selectedUrls.length > 0 && onDeleteMultiple) {
            onDeleteMultiple(selectedUrls);
            setIsEditing(false);
            setSelectedUrls([]);
        }
    };

    if (!fotosValidas || fotosValidas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 min-h-[200px] bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-400">Nenhuma foto adicionada.</p>
            </div>
        );
    }

    const MAX_VISIVEIS = 6;
    // Se estiver editando, mostra todas as fotos para permitir seleção. Se não, limita a MAX_VISIVEIS.
    const fotosParaExibir = isEditing ? fotosValidas : fotosValidas.slice(0, MAX_VISIVEIS);
    const fotosRestantes = !isEditing ? fotosValidas.length - MAX_VISIVEIS : 0;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (indexAberto !== null && indexAberto < fotosValidas.length - 1) setIndexAberto(indexAberto + 1);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (indexAberto !== null && indexAberto > 0) setIndexAberto(indexAberto - 1);
    };

    return (
        <>
            {/* BARRA DE FERRAMENTAS DA GALERIA */}
            {podeEditar && (
                <div className="flex justify-end mb-4 h-9">
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1398D4] transition-colors"
                        >
                            <Edit2 size={16} />
                            Editar Galeria
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500 mr-2">
                                {selectedUrls.length} selecionada(s)
                            </span>
                            <button 
                                onClick={() => { setIsEditing(false); setSelectedUrls([]); }}
                                className="px-3 py-1.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleConfirmDelete}
                                disabled={selectedUrls.length === 0}
                                className="px-3 py-1.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Excluir
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/*  GRADE DE FOTOS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fotosParaExibir.map((foto, idx) => {
                    const isUltimaFotoDaGrade = !isEditing && idx === MAX_VISIVEIS - 1;
                    const temMaisFotos = fotosRestantes > 0;
                    const isSelected = selectedUrls.includes(foto);

                    return (
                        <div 
                            key={foto} 
                            onClick={() => {
                                if (isEditing) {
                                    toggleSelection(foto);
                                } else {
                                    setIndexAberto(idx);
                                }
                            }}
                            className={`relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 ${
                                isSelected ? 'ring-4 ring-red-500 scale-[0.98]' : 'border border-gray-200 hover:shadow-md'
                            }`}
                        >
                            <Image 
                                src={foto} 
                                alt={`Foto ${idx + 1}`} 
                                fill 
                                className={`object-cover transition-transform duration-300 ${!isEditing && 'group-hover:scale-105'} ${isSelected ? 'opacity-80' : ''}`} 
                                unoptimized={true}
                                onError={() => handleImageError(foto)}
                            />

                            {/*  ÍCONE DE SELEÇÃO NO MODO DE EDIÇÃO */}
                            {isEditing && (
                                <div className="absolute top-3 right-3 z-20 bg-white/50 rounded-full backdrop-blur-sm">
                                    {isSelected ? (
                                        <CheckCircle2 size={24} className="text-red-500 fill-white" />
                                    ) : (
                                        <Circle size={24} className="text-gray-600/80 hover:text-gray-800" />
                                    )}
                                </div>
                            )}
                            
                            {isUltimaFotoDaGrade && temMaisFotos && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-colors group-hover:bg-black/70">
                                    <span className="text-white text-3xl font-bold">+{fotosRestantes}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* LIGHTBOX DE VISUALIZAÇÃO (SÓ ABRE FORA DO MODO DE EDIÇÃO) */}
            {indexAberto !== null && indexAberto < fotosValidas.length && !isEditing && (
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