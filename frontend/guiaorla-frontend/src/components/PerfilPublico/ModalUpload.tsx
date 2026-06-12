"use client";
import { X, Upload } from "lucide-react";

interface ModalUploadProps {
    isOpen: boolean;
    onClose: () => void;
    tipo: "galeria" | "header" | "profile"; 
}

export const ModalUpload = ({ isOpen, onClose, tipo = "galeria" }: ModalUploadProps) => {
    if (!isOpen) return null;

    // Ajuste de Proporção e Formato Visual
    const aspectClass = tipo === "header" 
        ? "aspect-[3/1] w-full" 
        : "aspect-square w-full max-w-[240px]";

    const shapeClass = tipo === "profile" 
        ? "rounded-full" 
        : "rounded-2xl";

    const modalWidthClass = tipo === "header" 
        ? "max-w-2xl" 
        : "max-w-md";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`bg-white w-full ${modalWidthClass} rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300`}>
                
                {/* Header do Modal Dinâmico */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">
                        {tipo === "header" && "Ajustar Foto de Capa"}
                        {tipo === "profile" && "Alterar Foto de Perfil"}
                        {tipo === "galeria" && "Adicionar à Galeria"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    {/* Área de Seleção Dinâmica */}
                    <div className={`relative group border-2 border-dashed border-[#1398D4]/30 hover:border-[#1398D4] bg-gray-50 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer text-center overflow-hidden ${shapeClass} ${aspectClass}`}>
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                            accept="image/*"
                        />
                        
                        <div className="flex flex-col items-center gap-3 p-4">
                            <div className="w-12 h-12 bg-[#1398D4]/10 rounded-full flex items-center justify-center text-[#1398D4] group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-[#0A4F6E] text-sm mx-2">
                                    {tipo === "header" && "Selecione a imagem de capa"}
                                    {tipo === "profile" && "Selecione sua foto de perfil"}
                                    {tipo === "galeria" && "Selecione a foto do serviço"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Clique ou arraste o arquivo</p>
                            </div>
                        </div>

                        <div className={`absolute inset-0 bg-[#0A4F6E]/5 pointer-events-none border-4 border-white/50 ${shapeClass}`}></div>
                    </div>

                    <div className="w-full flex flex-col gap-2 mt-5 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">
                            {tipo === "header" && "Visualize como sua capa ficará no site"}
                            {tipo === "profile" && "Visualize como seu avatar ficará no site"}
                            {tipo === "galeria" && "As imagens irão direto para seu portfólio"}
                        </p>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col md:flex-row gap-3 mt-6 w-full">
                        <button 
                            onClick={onClose}
                            className="order-2 md:order-1 flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancelar
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="order-1 md:order-2 flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg shadow-gray-200 transition-all active:scale-95"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};