"use client";
import { useState } from "react";
import { X, MapPin, Navigation, Search, Map as MapIcon } from "lucide-react";

interface ModalLocalizacaoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (local: { endereco: string; coords: { lat: number; lng: number } }) => void;
}

export const ModalLocalizacao = ({ isOpen, onClose, onSave }: ModalLocalizacaoProps) => {
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [previewLocal, setPreviewLocal] = useState({
        endereco: "Praia de Gaibu, Cabo de Santo Agostinho",
        coords: { lat: -8.3364, lng: -34.9451 }
    });

    if (!isOpen) return null;

    const buscarEndereco = () => {
        if (!busca) return;
        setCarregando(true);
        setTimeout(() => {
            setPreviewLocal({
                endereco: busca,
                coords: { lat: -8.3370, lng: -34.9460 }
            });
            setCarregando(false);
        }, 1000);
    };

    const usarLocalizacaoAtual = () => {
        if (!navigator.geolocation) {
            alert("Geolocalização não suportada.");
            return;
        }

        setCarregando(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            const localDetectado = {
                endereco: "Minha localização atual",
                coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }
            };
            setPreviewLocal(localDetectado);
            setCarregando(false);
            
            onSave(localDetectado);
            onClose();
        }, () => {
            alert("Erro ao obter localização.");
            setCarregando(false);
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">Definir Localização</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
            
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Digite o local ou ponto de referência..." 
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && buscarEndereco()}
                            className="w-full pl-11 pr-24 py-3 rounded-xl border border-gray-200 focus:border-[#FF7620] outline-none text-[#0A4F6E] font-medium"
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <button 
                            onClick={buscarEndereco}

                            className="absolute right-2 top-2 px-3 py-1.5 bg-[#FF7620] text-white text-xs font-bold rounded-lg hover:bg-[#e66a1d] transition-colors active:scale-95 shadow-md shadow-orange-100"
                        >
                            {carregando ? "..." : "Buscar"}
                        </button>
                    </div>

                    <button 
                        onClick={usarLocalizacaoAtual}
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#1398D4] text-[#1398D4] rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-[0.98] text-sm"
                    >
                        <Navigation size={18} className={carregando ? "animate-pulse" : ""} />
                        {carregando ? "Capturando GPS..." : "Usar minha localização atual"}
                    </button>

                    {/* PREVIEW DO MAPA */}
                    <div className="relative h-48 bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                        <MapIcon size={40} className="text-gray-300 relative z-10" />
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200 mt-2 relative z-10 flex items-center gap-2">
                            <MapPin size={14} className="text-red-500" />
                            <span className="text-[10px] font-bold text-[#0A4F6E] uppercase truncate max-w-[200px]">
                                {previewLocal.endereco}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <button 
                            onClick={onClose} 
                            className="order-2 md:order-1 flex-1 px-4 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => {
                                onSave(previewLocal);
                                onClose();
                            }}
                            className="order-1 md:order-2 flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg shadow-gray-200 transition-all active:scale-95"
                        >
                            Confirmar Local
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};