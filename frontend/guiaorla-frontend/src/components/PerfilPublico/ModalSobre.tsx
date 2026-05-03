"use client";
import { useState, useEffect } from "react";
import { X, AlignLeft } from "lucide-react";

interface ModalSobreProps {
    isOpen: boolean;
    onClose: () => void;
    valorAtual: string;
    onSave: (novoSobre: string) => void;
}

export const ModalSobre = ({ isOpen, onClose, valorAtual, onSave }: ModalSobreProps) => {
    const [sobre, setSobre] = useState(valorAtual);

    useEffect(() => {
        if (isOpen) setSobre(valorAtual);
    }, [isOpen, valorAtual]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">Editar Sobre</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4 text-left">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-[#0A4F6E]">
                        <AlignLeft size={20} />
                        <p className="text-sm font-medium">Conte um pouco sobre a história e o diferencial do seu negócio.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Sua Descrição</label>
                        <textarea 
                            value={sobre}
                            onChange={(e) => setSobre(e.target.value)}
                            rows={4}
                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#1398D4] outline-none font-medium text-gray-600 transition-all resize-none"
                            placeholder="Ex: Somos uma barraca familiar com 20 anos de tradição..."
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-4">
                        <button onClick={onClose} className="order-2 md:order-1 flex-1 px-4 py-3 font-bold text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                            Cancelar
                        </button>
                        <button 
                            onClick={() => { onSave(sobre); onClose(); }}
                            className="order-1 md:order-2 flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg shadow-blue-900/10 transition-all active:scale-95"
                        >
                            Salvar Bio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};