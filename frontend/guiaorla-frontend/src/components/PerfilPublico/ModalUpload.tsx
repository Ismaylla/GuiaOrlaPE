"use client";

import { API_URL } from "@/lib/config";
import { useState, ChangeEvent } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface ModalUploadProps {
    isOpen: boolean;
    onClose: () => void;
    tipo: "galeria" | "header" | "profile" | "card"; //  ADICIONADO: tipo "card"
    businessId: string;
    onSuccess?: (newUrl: string) => void;
}

export const ModalUpload = ({ isOpen, onClose, tipo = "galeria", businessId, onSuccess }: ModalUploadProps) => {
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("A imagem deve ter no máximo 5MB.");
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Selecione um arquivo antes de confirmar.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("File", file);

            const response = await fetch(`${API_URL}/api/business/${businessId}/upload?type=${tipo}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${(session as any)?.accessToken || ""}`
                },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Erro ao realizar upload no servidor.");
            }

            const data = await response.json(); 
            
            if (onSuccess) {
                onSuccess(data.url); 
            }

            handleClose();
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao enviar a imagem.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setError(null);
        onClose();
    };

    // AJUSTE: Formato dinâmico baseado no tipo. O card recebe uma proporção retangular 4:3
    const aspectClass = tipo === "header" 
        ? "aspect-[3/1] w-full" 
        : tipo === "card" 
        ? "aspect-[4/3] w-full" 
        : "aspect-square w-full max-w-[240px]";
        
    const shapeClass = tipo === "profile" ? "rounded-full" : "rounded-2xl";
    const modalWidthClass = tipo === "header" ? "max-w-2xl" : "max-w-md";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`bg-white w-full ${modalWidthClass} rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300`}>
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">
                        {tipo === "header" && "Ajustar Foto de Capa"}
                        {tipo === "profile" && "Alterar Foto de Perfil"}
                        {tipo === "galeria" && "Adicionar à Galeria"}
                        {tipo === "card" && "Alterar Foto da Vitrine"} {/*  NOVO TÍTULO */}
                    </h3>
                    <button onClick={handleClose} disabled={isUploading} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 disabled:opacity-50">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className={`relative group border-2 border-dashed border-[#1398D4]/30 hover:border-[#1398D4] bg-gray-50 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer text-center overflow-hidden ${shapeClass} ${aspectClass}`}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-3 p-4">
                                <div className="w-12 h-12 bg-[#1398D4]/10 rounded-full flex items-center justify-center text-[#1398D4] group-hover:scale-110 transition-transform">
                                    <Upload size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#0A4F6E] text-sm mx-2">Selecione a imagem</p>
                                    <p className="text-xs text-gray-400 mt-1">Clique ou arraste o arquivo</p>
                                </div>
                            </div>
                        )}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleFileChange} disabled={isUploading} />
                        <div className={`absolute inset-0 bg-[#0A4F6E]/5 pointer-events-none border-4 border-white/50 ${shapeClass}`}></div>
                    </div>

                    {error && <p className="text-xs text-red-500 font-semibold mt-3 bg-red-50 px-3 py-1.5 rounded-lg">{error}</p>}

                    <div className="flex flex-col md:flex-row gap-3 mt-6 w-full">
                        <button onClick={handleClose} disabled={isUploading} className="order-2 md:order-1 flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50">Cancelar</button>
                        <button onClick={handleUpload} disabled={isUploading || !file} className="order-1 md:order-2 flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-gray-300">
                            {isUploading ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : "Confirmar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};