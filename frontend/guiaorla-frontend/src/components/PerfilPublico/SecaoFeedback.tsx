"use client";
import { Star, User, MessageSquare, Plus } from "lucide-react";

interface SecaoFeedbackProps {
    nota: number;
    totalAvaliacoes: number;
    exibirBotaoAvaliar?: boolean;
}

export const SecaoFeedback = ({ nota, totalAvaliacoes, exibirBotaoAvaliar = false }: SecaoFeedbackProps) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {/* CABEÇALHO DE NOTAS */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-[#FF7620]/10 p-4 rounded-2xl">
                        <span className="text-3xl font-black text-[#FF7620]">{nota.toFixed(1)}</span>
                    </div>
                    <div>
                        <div className="flex gap-1 mb-1 text-left">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    size={16} 
                                    className={i < Math.floor(nota) ? "text-[#FF7620] fill-[#FF7620]" : "text-gray-200"} 
                                />
                            ))}
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider text-left">{totalAvaliacoes} Avaliações</p>
                    </div>
                </div>
                
                {exibirBotaoAvaliar && totalAvaliacoes > 0 && (
                    <button 
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0A4F6E] text-white rounded-xl font-bold text-sm hover:bg-[#083d55] transition-all active:scale-95 shadow-md shadow-blue-900/10"
                        onClick={() => console.log("Fluxo de avaliação")}
                    >
                        <Plus size={18} />
                        Avaliar Negócio
                    </button>
                )}
            </div>

            {/* FLUXO CONDICIONAL DO BANCO DE DADOS */}
            {totalAvaliacoes === 0 ? (
                /* SE NÃO HOUVER AVALIAÇÃO, MOSTRA O ESTADO VAZIO */
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <div className="bg-[#FF7620]/10 p-4 rounded-full text-[#FF7620] mb-3">
                        <MessageSquare size={28} />
                    </div>
                    <h4 className="font-bold text-[#0A4F6E] text-base mb-1">
                        Nenhuma avaliação ainda
                    </h4>
                    <p className="text-gray-400 text-xs max-w-[280px] leading-relaxed font-medium">
                        Seja o primeiro a visitar e deixar sua opinião sobre este local!
                    </p>
                    
                    {exibirBotaoAvaliar && (
                        <button className="mt-4 bg-[#FF7620] text-white px-5 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-sm">
                            Avaliar agora
                        </button>
                    )}
                </div>
            ) : (
                /* SE HOUVER AVALIAÇÃO, LISTARIA OS COMENTÁRIOS DO BANCO AQUI */
                <div className="flex flex-col gap-6">
                    <p className="text-gray-500 text-xs italic">Carregando comentários...</p>
                </div>
            )}
        </div>
    );
};