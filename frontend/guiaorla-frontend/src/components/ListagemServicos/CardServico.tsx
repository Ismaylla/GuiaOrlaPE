// src/components/ListagemServicos/CardServico.tsx
"use client";
import { useState } from "react";
import Image from "next/image";

// Definindo o que um Serviço precisa ter (ajuda muito no futuro backend)
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
    variante: "vertical" | "horizontal"; // Define o layout do card
}

function DescricaoExpansivel({ texto }: { texto: string }) {
    const [expandido, setExpandido] = useState(false);
    const isLongo = texto.length > 60;
    return (
        <div className="cursor-pointer" onClick={() => isLongo && setExpandido(!expandido)}>
            <p className={`text-gray-500 text-[10px] md:text-xs leading-tight text-left transition-all duration-300 ${expandido ? "" : "line-clamp-2"}`}>
                {texto}
                {isLongo && !expandido && <span className="text-[#1398D4] font-bold ml-1">...</span>}
            </p>
        </div>
    );
}

export const CardServico = ({ item, variante }: ServicoProps) => {
    // LAYOUT VERTICAL (Carrossel)
    if (variante === "vertical") {
        return (
            <div className="group bg-white rounded-3xl shrink-0 w-[230px] md:w-[220px] shadow-sm border border-gray-100 overflow-hidden snap-center flex flex-col h-auto hover:shadow-lg transition-all duration-300 ease-out">
                <div className="relative h-32 md:h-36 w-full shrink-0">
                    <Image src={item.img} alt={item.nome} fill className="object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                        <div className={`w-2 h-2 rounded-full ${item.aberto ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <span className="text-[9px] text-white font-bold uppercase tracking-tight">{item.aberto ? 'Aberto' : 'Fechado'}</span>
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-1 pointer-events-auto">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-bold text-[#0A4F6E] text-xs md:text-sm leading-tight text-left line-clamp-2">{item.nome}</h3>
                        <div className="bg-[#1398D4] text-white px-2 py-0.5 font-bold text-[10px] md:text-xs shadow-sm shrink-0" style={{ borderRadius: '12px 0px 12px 0px' }}>{item.nota}</div>
                    </div>
                    <div className="mb-4"><DescricaoExpansivel texto={item.desc} /></div>
                    <div className="flex flex-col gap-2 mt-auto w-full">
                        <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: 'linear-gradient(180deg, #27CB43 0%, #0F9326 80%)' }}>VER NO MAPA</button>
                        <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 80%)' }}>VER PERFIL</button>
                    </div>
                </div>
            </div>
        );
    }

    // LAYOUT HORIZONTAL (Listagem Geral)
    return (
        <div className="group relative">
            <div className="bg-white p-3 md:p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 h-full hover:shadow-lg transition-shadow items-start">
                <div className="relative h-28 w-28 md:h-40 md:w-36 shrink-0">
                    <Image src={item.img} alt={item.nome} fill className="object-cover rounded-2xl" />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded-lg shadow-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.aberto ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-[8px] font-bold text-gray-700">{item.aberto ? 'ON' : 'OFF'}</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 min-h-full">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <h3 className="text-[#0A4F6E] font-bold text-sm md:text-base leading-tight text-left">{item.nome}</h3>
                            <div className="bg-[#1398D4] text-white px-2 py-1 font-bold text-xs shadow-sm shrink-0" style={{ borderRadius: '15px 0px 15px 0px' }}>{item.nota}</div>
                        </div>
                        <DescricaoExpansivel texto={item.desc} />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-4">
                        <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: 'linear-gradient(180deg, #27CB43 0%, #0F9326 80%)' }}>MAPA</button>
                        <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 80%)' }}>VER MAIS</button>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-6 left-0 right-0 h-[1px] bg-gray-200 hidden lg:block"></div>
            <hr className="mt-8 border-gray-200 lg:hidden" />
        </div>
    );
};