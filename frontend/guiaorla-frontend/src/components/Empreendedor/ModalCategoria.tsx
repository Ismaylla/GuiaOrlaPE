"use client";
import { useState } from "react";
import { X, Check, Store } from "lucide-react";

interface ModalCategoriaProps {
    isOpen: boolean;
    onClose: () => void;
    categoriaAtual: string;
    onSave: (categoria: string) => void;
}

export const ModalCategoria = ({ isOpen, onClose, categoriaAtual, onSave }: ModalCategoriaProps) => {
    const [selecionada, setSelecionada] = useState(categoriaAtual);
    const categorias = ["Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        {/* Ícone agora em Azul */}
                        <div className="p-2 bg-white rounded-xl shadow-sm text-[#0A4F6E]"><Store size={20} /></div>
                        <h3 className="font-bold text-[#0A4F6E]">Tipo de Serviço</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-3">
                    <p className="text-xs text-gray-500 mb-4 font-medium italic">Como você quer ser encontrado nas buscas?</p>
                    {categorias.map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setSelecionada(cat)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                selecionada === cat 
                                    ? "border-[#1398D4] bg-blue-50 text-[#0A4F6E]" 
                                    : "border-gray-100 hover:border-gray-200 text-gray-600"
                            }`}
                        >
                            <span className="font-bold text-sm">{cat}</span>
                            {selecionada === cat && <Check size={18} className="text-[#1398D4]" />}
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-gray-50">
                    {/* BOTÃO AGORA EM AZUL PADRÃO */}
                    <button 
                        onClick={() => { onSave(selecionada); onClose(); }}
                        className="w-full py-4 bg-[#0A4F6E] text-white rounded-2xl font-bold shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all hover:bg-[#083d55]"
                    >
                        Salvar Categoria
                    </button>
                </div>
            </div>
        </div>
    );
};