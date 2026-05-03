

// "use client";
// import Image from "next/image";
// import Link from "next/link"; // Importação necessária para a rota

// interface ServicoProps {
//     item: {
//         id: number;
//         nome: string;
//         categoria: string;
//         nota: number;
//         desc: string;
//         img: string;
//         aberto: boolean;
//         aceitaCard: boolean;
//     };
//     variante: "vertical" | "horizontal";
//     isEmpreendedor?: boolean;
// }

// function DescricaoExpansivel({ texto }: { texto: string }) {
//     return (
//         <div className="w-full">
//             <p className="text-gray-500 text-[10px] md:text-xs leading-tight text-left line-clamp-2">
//                 {texto}
//             </p>
//         </div>
//     );
// }

// export const CardServico = ({ item, variante, isEmpreendedor = false }: ServicoProps) => {
//     const mainColor = "#1398D4";
//     const darkColor = "#0A4F6E";
//     const textTitleColor = "text-[#0A4F6E]";
//     const notaBg = "bg-[#1398D4]";
//     const gradientAzul = `linear-gradient(180deg, ${mainColor} 0%, ${darkColor} 80%)`;

//     // Lógica da rota baseada no fluxo (Empreendedor ou Usuário)
//     const rotaDestino = isEmpreendedor 
//         ? `/empreendedor/perfil/${item.id}` 
//         : `/perfil/${item.id}`;

//     if (variante === "vertical") {
//         return (
//             <div className="group bg-white rounded-3xl shrink-0 w-[230px] md:w-[220px] shadow-sm border border-gray-100 overflow-hidden snap-center flex flex-col h-auto hover:shadow-lg transition-all duration-300 ease-out">
//                 <div className="relative h-32 md:h-36 w-full shrink-0">
//                     <Image src={item.img} alt={item.nome} fill className="object-cover" />
//                     <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
//                         <div className={`w-2 h-2 rounded-full ${item.aberto ? 'bg-green-400' : 'bg-gray-400'}`}></div>
//                         <span className="text-[9px] text-white font-bold uppercase tracking-tight">{item.aberto ? 'Aberto' : 'Fechado'}</span>
//                     </div>
//                 </div>
//                 <div className="p-4 flex flex-col flex-1">
//                     <div className="flex justify-between items-start mb-2 gap-2">
//                         <h3 className={`font-bold ${textTitleColor} text-xs md:text-sm leading-tight text-left line-clamp-2`}>{item.nome}</h3>
//                         <div className={`${notaBg} text-white px-2 py-0.5 font-bold text-[10px] md:text-xs shadow-sm shrink-0`} style={{ borderRadius: '12px 0px 12px 0px' }}>{item.nota}</div>
//                     </div>
//                     <div className="mb-4">
//                         <DescricaoExpansivel texto={item.desc} />
//                     </div>
//                     <div className="flex flex-col gap-2 mt-auto w-full">
//                         <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: gradientAzul }}>VER NO MAPA</button>
                        
//                         {/* Rota para o Perfil Público */}
//                         <Link href={rotaDestino} className="w-full">
//                             <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: gradientAzul }}>
//                                 VER PERFIL
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="group relative">
//             <div className="bg-white p-3 md:p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 h-full hover:shadow-lg transition-shadow items-start">
//                 <div className="relative h-28 w-28 md:h-40 md:w-36 shrink-0">
//                     <Image src={item.img} alt={item.nome} fill className="object-cover rounded-2xl" />
//                     <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded-lg shadow-sm">
//                         <div className={`w-1.5 h-1.5 rounded-full ${item.aberto ? 'bg-green-500' : 'bg-gray-400'}`}></div>
//                         <span className="text-[8px] font-bold text-gray-700">{item.aberto ? 'ON' : 'OFF'}</span>
//                     </div>
//                 </div>
//                 <div className="flex-1 flex flex-col justify-between py-1 min-h-full">
//                     <div className="flex flex-col">
//                         <div className="flex justify-between items-start mb-2 gap-2">
//                             <h3 className={`${textTitleColor} font-bold text-sm md:text-base leading-tight text-left`}>{item.nome}</h3>
//                             <div className={`${notaBg} text-white px-2 py-1 font-bold text-xs shadow-sm shrink-0`} style={{ borderRadius: '15px 0px 15px 0px' }}>{item.nota}</div>
//                         </div>
//                         <DescricaoExpansivel texto={item.desc} />
//                     </div>
//                     <div className="flex flex-col gap-1.5 mt-4">
//                         <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: gradientAzul }}>MAPA</button>
                        
//                         {/* Botão Ver Mais (mantido original como solicitado) */}
//                         <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: gradientAzul }}>
//                             VER MAIS
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <div className="absolute -bottom-6 left-0 right-0 h-[1px] bg-gray-200 hidden lg:block"></div>
//             <hr className="mt-8 border-gray-200 lg:hidden" />
//         </div>
//     );
// };

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

export const CardServico = ({ item, variante, isEmpreendedor = false }: ServicoProps) => {
    // Estado para garantir que a rota só seja injetada no cliente, evitando mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const mainColor = "#1398D4";
    const darkColor = "#0A4F6E";
    const textTitleColor = "text-[#0A4F6E]";
    const notaBg = "bg-[#1398D4]";
    const gradientAzul = `linear-gradient(180deg, ${mainColor} 0%, ${darkColor} 80%)`;

    // Lógica da rota baseada no fluxo
    const rotaDestino = isEmpreendedor 
        ? `/empreendedor/perfil/${item.id}` 
        : `/perfil/${item.id}`;

    // Fallback seguro para o servidor (SSR)
    const hrefFinal = mounted ? rotaDestino : "#";

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
                <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className={`font-bold ${textTitleColor} text-xs md:text-sm leading-tight text-left line-clamp-2`}>{item.nome}</h3>
                        <div className={`${notaBg} text-white px-2 py-0.5 font-bold text-[10px] md:text-xs shadow-sm shrink-0`} style={{ borderRadius: '12px 0px 12px 0px' }}>{item.nota}</div>
                    </div>
                    <div className="mb-4">
                        <DescricaoExpansivel texto={item.desc} />
                    </div>
                    <div className="flex flex-col gap-2 mt-auto w-full">
                        <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: gradientAzul }}>VER NO MAPA</button>
                        
                        {/* Correção: Link estilizado como botão (sem tag button dentro) */}
                        <Link 
                            href={hrefFinal} 
                            className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95 flex items-center justify-center" 
                            style={{ background: gradientAzul }}
                        >
                            VER PERFIL
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                            <h3 className={`${textTitleColor} font-bold text-sm md:text-base leading-tight text-left`}>{item.nome}</h3>
                            <div className={`${notaBg} text-white px-2 py-1 font-bold text-xs shadow-sm shrink-0`} style={{ borderRadius: '15px 0px 15px 0px' }}>{item.nota}</div>
                        </div>
                        <DescricaoExpansivel texto={item.desc} />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-4">
                        <button className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" style={{ background: gradientAzul }}>MAPA</button>
                        
                        <button 
                            onClick={() => console.log("Abrir Modal de Resumo")}
                            className="w-full py-1.5 text-white rounded-full font-bold text-[10px] shadow-md transition-transform active:scale-95" 
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