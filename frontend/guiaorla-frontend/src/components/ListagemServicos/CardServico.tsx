"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ServicoProps {
    item: {
        id: number;
        nome: string;
        categoria: string;
        nota: number;
        desc: string;
        img: string;
        aberto: boolean;
        aceitaCard: boolean;
    };
    variante: "vertical" | "horizontal";
    isEmpreendedor?: boolean;
    onOpenModal?: (item: any) => void;
}

function DescricaoExpansivel({ texto }: { texto: string }) {
    return (
        <div className="w-full">
            <p className="text-gray-500 text-[10px] md:text-xs leading-tight text-left line-clamp-2">
                {texto}
            </p>
        </div>
    );
}

export const CardServico = ({ item, variante, onOpenModal }: ServicoProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const textTitleColor = "text-[#0A4F6E]";
    const notaBg = "bg-[#1398D4]";
    const gradientAzul = `linear-gradient(180deg, #1398D4 0%, #0A4F6E 80%)`;

    if (!mounted) return null;

    if (variante === "vertical") {
        return (
            <div className="bg-white rounded-3xl shrink-0 w-[230px] md:w-[220px] shadow-sm border border-gray-100 overflow-hidden snap-center flex flex-col h-[340px] transition-all duration-300 ease-out hover:shadow-lg">
                <div className="relative h-32 md:h-36 w-full shrink-0">
                    <Image src={item.img} alt={item.nome} fill className="object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                        <div className={`w-2 h-2 rounded-full ${item.aberto ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <span className="text-[9px] text-white font-bold uppercase tracking-tight">{item.aberto ? 'Aberto' : 'Fechado'}</span>
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className={`font-bold ${textTitleColor} text-xs md:text-sm leading-tight text-left line-clamp-2`}>{item.nome}</h3>
                        <div className={`${notaBg} text-white px-2 py-0.5 font-bold text-[10px] md:text-xs shadow-sm shrink-0`} style={{ borderRadius: '12px 0px 12px 0px' }}>{item.nota}</div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <DescricaoExpansivel texto={item.desc} />
                    </div>
                    <div className="mt-auto pt-4">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Impede qualquer clique de vazar para o card
                                onOpenModal?.(item);
                            }}
                            className="w-full py-2.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95 flex items-center justify-center cursor-pointer" 
                            style={{ background: gradientAzul }}
                        >
                            VER MAIS
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative">
            <div className="bg-white p-3 md:p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 h-full transition-shadow items-start hover:shadow-lg">
                <div className="relative h-28 w-28 md:h-40 md:w-36 shrink-0">
                    <Image src={item.img} alt={item.nome} fill className="object-cover rounded-2xl" />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded-lg shadow-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.aberto ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-[8px] font-bold text-gray-700">{item.aberto ? 'ON' : 'OFF'}</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between min-h-[110px] md:min-h-[160px] py-1">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <h3 className={`${textTitleColor} font-bold text-sm md:text-base leading-tight text-left`}>{item.nome}</h3>
                            <div className={`${notaBg} text-white px-2 py-1 font-bold text-xs shadow-sm shrink-0`} style={{ borderRadius: '15px 0px 15px 0px' }}>{item.nota}</div>
                        </div>
                        <DescricaoExpansivel texto={item.desc} />
                    </div>
                    <div className="mt-auto pt-4">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onOpenModal?.(item);
                            }}
                            className="w-full py-2.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95 cursor-pointer" 
                            style={{ background: gradientAzul }}
                        >
                            VER MAIS
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-6 left-0 right-0 h-[1px] bg-gray-200 hidden lg:block"></div>
            <hr className="mt-8 border-gray-200 lg:hidden" />
        </div>
    );
};