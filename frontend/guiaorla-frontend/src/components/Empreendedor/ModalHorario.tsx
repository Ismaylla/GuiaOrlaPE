"use client";
import { useState, useEffect } from "react";
import { X, Clock, ArrowRight } from "lucide-react";

interface ModalHorarioProps {
    isOpen: boolean;
    onClose: () => void;
    valorAtual: string;
    onSave: (novoHorario: string) => void;
}

export const ModalHorario = ({ isOpen, onClose, valorAtual, onSave }: ModalHorarioProps) => {
    // Estados independentes para hora e minutos
    const [horaAbertura, setHoraAbertura] = useState("08:00");
    const [horaFechamento, setHoraFechamento] = useState("18:00");

    useEffect(() => {
        if (isOpen && valorAtual.includes(" às ")) {
            const [vInicio, vFim] = valorAtual.split(" às ");
            // Garante que o formato seja HH:mm para o input type="time"
            setHoraAbertura(vInicio);
            setHoraFechamento(vFim);
        }
    }, [isOpen, valorAtual]);

    if (!isOpen) return null;

    const handleSalvar = () => {
        // Retorna a string formatada para o Gerenciamento e Meu Perfil
        const horarioFormatado = `${horaAbertura} às ${horaFechamento}`;
        onSave(horarioFormatado);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">Editar Horário</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-[#0A4F6E]">
                        <Clock size={24} />
                        <p className="text-sm font-medium">Selecione o horário em que seu negócio está operando.</p>
                    </div>

                    {/* Seletores de Hora e Minutos Nativos */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Abertura</label>
                            <input 
                                type="time" 
                                value={horaAbertura}
                                onChange={(e) => setHoraAbertura(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1398D4] outline-none text-[#0A4F6E] font-bold bg-gray-50 cursor-pointer"
                            />
                        </div>

                        <ArrowRight className="mt-6 text-gray-300 shrink-0" size={20} />

                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Fechamento</label>
                            <input 
                                type="time" 
                                value={horaFechamento}
                                onChange={(e) => setHoraFechamento(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1398D4] outline-none text-[#0A4F6E] font-bold bg-gray-50 cursor-pointer"
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-gray-400 text-center italic">
                        Clique nos campos para abrir o seletor de horas e minutos do seu sistema.
                    </p>

                    {/* Botões */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <button 
                            onClick={onClose}
                            className="order-2 md:order-1 flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSalvar}
                            className="order-1 md:order-2 flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg shadow-gray-200 transition-all active:scale-95"
                        >
                            Salvar Alteração
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};