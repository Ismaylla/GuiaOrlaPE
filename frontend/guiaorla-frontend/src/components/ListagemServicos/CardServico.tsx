"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface ServicoProps {
    item: {
        id: number | string;
        nome: string;
        categoria: string;
        nota: number | string;
        desc: string;
        description?: string;
        horario?: string;
        img?: string;
        cardImageUrl?: string;
        aberto: boolean;
        aceitaCard: boolean;
    };
    variante: "vertical" | "horizontal";
    isEmpreendedor?: boolean;
    onOpenModal?: (item: any) => void;
}

const obterImagemValida = (src?: string | null) => {
    if (!src) return "/images/fundopraia.jpg";
    const ehValido = src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
    return ehValido ? src : "/images/fundopraia.jpg";
};

// LIMITE dinâmico: vertical (card menor) = 90 | horizontal (card maior) = 160
function DescricaoExpansivel({ texto, limite }: { texto: string; limite: number }) {
    const [expandido, setExpandido] = useState(false);

    const textoExibicao =
        expandido && texto.length > limite
            ? texto.slice(0, limite) + "..."
            : texto;

    return (
        <div
            className="w-full cursor-pointer group"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpandido(!expandido);
            }}
        >
            <p
                className={`text-gray-500 text-[10px] md:text-xs leading-tight text-left transition-all duration-300 break-all ${
                    expandido ? "" : "line-clamp-2"
                }`}
            >
                {textoExibicao}
            </p>
            {!expandido && texto.length > limite * 0.85 && (
                <span className="text-[9px] text-[#1398D4] font-medium group-hover:underline mt-0.5 inline-block">
                    Ler mais
                </span>
            )}
        </div>
    );
}

export const CardServico = ({ item, variante, onOpenModal }: ServicoProps) => {
    const [mounted, setMounted] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setImgError(false);
    }, [item.cardImageUrl, item.img]);

    const textTitleColor = "text-[#0A4F6E]";
    const notaBg = "bg-[#1398D4]";
    const gradientAzul = `linear-gradient(180deg, #1398D4 0%, #0A4F6E 80%)`;

    if (!mounted) return null;

    const imagemExibicao =
        imgError
            ? "/images/fundopraia.jpg"
            : obterImagemValida(item.cardImageUrl || item.img);

    const bioTexto =
        item.description && item.description.trim() !== ""
            ? item.description
            : "O empreendedor ainda não adicionou uma bio. Venha conhecer!";

    // ─── Limites por variante ────────────────────────────────────────────────
    // "vertical"   = card estreito (Próximos de você) → cabe menos texto
    // "horizontal" = card largo  (Todos os estabelecimentos) → cabe mais texto
    const LIMITE_VERTICAL = 90;
    const LIMITE_HORIZONTAL = 200;

    if (variante === "vertical") {
        return (
            <div className="bg-white rounded-3xl shrink-0 w-[230px] md:w-[220px] shadow-sm border border-gray-100 overflow-hidden snap-center flex flex-col h-[340px] transition-all duration-300 ease-out hover:shadow-lg">
                <div className="relative h-32 md:h-36 w-full shrink-0">
                    <Image
                        src={imagemExibicao}
                        alt={item.nome || "Imagem do serviço"}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={() => setImgError(true)}
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                        <div
                            className={`w-2 h-2 rounded-full ${
                                item.aberto ? "bg-green-400" : "bg-gray-400"
                            }`}
                        ></div>
                        <span className="text-[9px] text-white font-bold uppercase tracking-tight">
                            {item.aberto ? "Aberto" : "Fechado"}
                        </span>
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                        <h3
                            className={`font-bold ${textTitleColor} text-xs md:text-sm leading-tight text-left line-clamp-1`}
                            title={item.nome}
                        >
                            {item.nome}
                        </h3>
                        <div
                            className={`${notaBg} text-white px-2 py-0.5 font-bold text-[10px] md:text-xs shadow-sm shrink-0`}
                            style={{ borderRadius: "12px 0px 12px 0px" }}
                        >
                            {item.nota === "N/A" ? "Novo" : item.nota}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                        <MapPin size={12} className="shrink-0 text-[#1398D4]" />
                        <span
                            className="text-[9px] md:text-[10px] text-gray-400 font-medium truncate"
                            title={item.desc}
                        >
                            {item.desc}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {/* Limite menor para o card vertical */}
                        <DescricaoExpansivel texto={bioTexto} limite={LIMITE_VERTICAL} />
                    </div>

                    <div className="mt-auto pt-4 shrink-0">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
                    <Image
                        src={imagemExibicao}
                        alt={item.nome || "Imagem do serviço"}
                        fill
                        className="object-cover rounded-2xl"
                        unoptimized
                        onError={() => setImgError(true)}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded-lg shadow-sm">
                        <div
                            className={`w-1.5 h-1.5 rounded-full ${
                                item.aberto ? "bg-green-500" : "bg-gray-400"
                            }`}
                        ></div>
                        <span className="text-[8px] font-bold text-gray-700">
                            {item.aberto ? "ON" : "OFF"}
                        </span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between min-h-[110px] md:min-h-[160px] py-1">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                            <h3
                                className={`${textTitleColor} font-bold text-sm md:text-base leading-tight text-left line-clamp-1`}
                                title={item.nome}
                            >
                                {item.nome}
                            </h3>
                            <div
                                className={`${notaBg} text-white px-2 py-1 font-bold text-xs shadow-sm shrink-0`}
                                style={{ borderRadius: "15px 0px 15px 0px" }}
                            >
                                {item.nota === "N/A" ? "Novo" : item.nota}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                            <MapPin size={12} className="shrink-0 text-[#1398D4]" />
                            <span
                                className="text-[10px] md:text-xs text-gray-400 font-medium truncate"
                                title={item.desc}
                            >
                                {item.desc}
                            </span>
                        </div>

                        {/* Limite maior para o card horizontal */}
                        <DescricaoExpansivel texto={bioTexto} limite={LIMITE_HORIZONTAL} />
                    </div>
                    <div className="mt-auto pt-4 shrink-0">
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
