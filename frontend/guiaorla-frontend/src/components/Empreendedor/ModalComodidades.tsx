"use client";
import { useState } from "react";
import { X, Settings, Check, Wifi, Dog, Accessibility, Sun, Umbrella } from "lucide-react";

interface ModalComodidadesProps {
    isOpen: boolean;
    onClose: () => void;
    comodidadesAtuais: string[];
    onSave: (selecionados: string[]) => void;
}

export const ModalComodidades = ({ isOpen, onClose, comodidadesAtuais, onSave }: ModalComodidadesProps) => {
    const [selecionados, setSelecionados] = useState<string[]>(comodidadesAtuais);

    const opcoes = [
        { id: "Wi-fi Grátis", label: "Wi-fi Grátis", icon: <Wifi size={20} className="text-[#1398D4]" /> },
        { id: "Pet Friendly", label: "Pet Friendly", icon: <Dog size={20} className="text-[#1398D4]" /> },
        { id: "Acessibilidade", label: "Acessibilidade", icon: <Accessibility size={20} className="text-[#1398D4]" /> },
        { id: "Ducha/Chuveiro", label: "Ducha/Chuveiro", icon: <Sun size={20} className="text-[#1398D4]" /> },
        { id: "Aluguel de Guarda-sol", label: "Guarda-sol", icon: <Umbrella size={20} className="text-[#1398D4]" /> },
    ];

    if (!isOpen) return null;

    const toggleOpcao = (id: string) => {
        setSelecionados(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">Comodidades e Filtros</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors active:scale-90">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-[#0A4F6E]">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Settings size={20} />
                        </div>
                        <p className="text-sm font-medium">Marque o que seu estabelecimento oferece aos turistas.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {opcoes.map((opcao) => {
                            const isSelected = selecionados.includes(opcao.id);
                            return (
                                <button
                                    key={opcao.id}
                                    onClick={() => toggleOpcao(opcao.id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                                        isSelected 
                                        ? "border-[#1398D4] bg-blue-50/30" 
                                        : "border-gray-50 hover:border-gray-200 bg-gray-50/50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-colors ${isSelected ? "bg-white shadow-sm" : "bg-transparent"}`}>
                                            {opcao.icon}
                                        </div>
                                        <span className={`font-bold text-sm ${isSelected ? "text-[#0A4F6E]" : "text-gray-400"}`}>
                                            {opcao.label}
                                        </span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected ? "bg-[#1398D4] border-[#1398D4]" : "border-gray-300"
                                    }`}>
                                        {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-2">
                        <button onClick={onClose} className="order-2 md:order-1 flex-1 px-4 py-3 font-bold text-gray-400 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
                            Cancelar
                        </button>
                        <button 
                            onClick={() => { onSave(selecionados); onClose(); }}
                            className="order-1 md:order-2 flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg shadow-blue-900/10 transition-all active:scale-95"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};