"use client";
import { Star, User, MessageSquare, Plus } from "lucide-react";

interface SecaoFeedbackProps {
    nota: number;
    totalAvaliacoes: number;
    exibirBotaoAvaliar?: boolean;
}

export const SecaoFeedback = ({ nota, totalAvaliacoes, exibirBotaoAvaliar = false }: SecaoFeedbackProps) => {
    // Mock para visualização
    const comentarios = [
        { id: 1, usuario: "Carlos Silva", nota: 5, texto: "Melhor coco da região! Gelado e o atendimento é nota 10.", data: "2 dias atrás" },
        { id: 2, usuario: "Ana Souza", nota: 4, texto: "Muito bom, mas a fila estava um pouco grande no domingo.", data: "1 semana atrás" }
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-[#FF7620]/10 p-4 rounded-2xl">
                        <span className="text-3xl font-black text-[#FF7620]">{nota}</span>
                    </div>
                    <div>
                        <div className="flex gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    size={16} 
                                    className={i < Math.floor(nota) ? "text-[#FF7620] fill-[#FF7620]" : "text-gray-200"} 
                                />
                            ))}
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{totalAvaliacoes} Avaliações</p>
                    </div>
                </div>
                
                {exibirBotaoAvaliar && (
                    <button 
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0A4F6E] text-white rounded-xl font-bold text-sm hover:bg-[#083d55] transition-all active:scale-95 shadow-md shadow-blue-900/10"
                        onClick={() => console.log("Fluxo de autenticação na próxima branch")}
                    >
                        <Plus size={18} />
                        Avaliar Negócio
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-6">
                {comentarios.map((c) => (
                    <div key={c.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                            <User size={20} className="text-gray-400" />
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-[#0A4F6E] text-sm">{c.usuario}</span>
                                <span className="text-gray-300 text-[10px]">•</span>
                                <span className="text-gray-400 text-[10px]">{c.data}</span>
                            </div>
                            <div className="flex gap-0.5 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < c.nota ? "text-[#FF7620] fill-[#FF7620]" : "text-gray-200"} />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{c.texto}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-[#0A4F6E] rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95 border border-gray-100 w-full justify-center sm:w-auto">
                    <MessageSquare size={16} />
                    Ver todos os comentários
                </button>
            </div>
        </div>
    );
};