"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, Navigation, Search, MapPin, Loader2 } from "lucide-react";

const MapaCaptura = dynamic(
    () => import("./MapaCaptura").then((mod) => mod.MapaCaptura),
    { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-400">Carregando mapa interativo...</div> }
);

interface ModalLocalizacaoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (local: { endereco: string; coords: { lat: number; lng: number } }) => void;
    // NOVAS PROPS: Para receber o que já está salvo no banco
    enderecoAtual?: string;
    latitudeAtual?: number;
    longitudeAtual?: number;
}

interface Sugestao {
    display_name: string;
    lat: string;
    lon: string;
}

export const ModalLocalizacao = ({ 
    isOpen, 
    onClose, 
    onSave,
    enderecoAtual,
    latitudeAtual,
    longitudeAtual 
}: ModalLocalizacaoProps) => {
    const [busca, setBusca] = useState("");
    const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    
    const [previewLocal, setPreviewLocal] = useState({
        endereco: "Praia de Gaibu, Cabo de Santo Agostinho",
        coords: { lat: -8.3364, lng: -34.9451 }
    });

    // Sincroniza o estado do modal com o dado atual do banco toda vez que ele for aberto
    useEffect(() => {
        if (isOpen) {
            setPreviewLocal({
                endereco: enderecoAtual || "Praia de Gaibu, Cabo de Santo Agostinho",
                coords: { lat: latitudeAtual || -8.3364, lng: longitudeAtual || -34.9451 }
            });
            setBusca(enderecoAtual || "");
        }
    }, [isOpen, enderecoAtual, latitudeAtual, longitudeAtual]);

    // Efeito para buscar sugestões (Autocomplete)
    useEffect(() => {
        if (busca.length < 3) {
            setSugestoes([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(busca)}&limit=5&countrycodes=br`,
                    { headers: { "User-Agent": "GuiaOrlaPE" } }
                );
                if (response.ok) {
                    const dados = await response.json();
                    setSugestoes(dados);
                    setMostrarSugestoes(true);
                }
            } catch (err) {
                console.error("Erro ao buscar sugestões:", err);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [busca]);

    if (!isOpen) return null;

    const obterEnderecoPorCoordenadas = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                { headers: { "User-Agent": "GuiaOrlaPE" } }
            );
            if (response.ok) {
                const dados = await response.json();
                return dados.display_name || `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
        } catch (err) {
            console.error(err);
        }
        return `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    const selecionarSugestao = (sugestao: Sugestao) => {
        const lat = parseFloat(sugestao.lat);
        const lng = parseFloat(sugestao.lon);
        
        setPreviewLocal({
            endereco: sugestao.display_name,
            coords: { lat, lng }
        });
        setBusca(sugestao.display_name);
        setMostrarSugestoes(false);
    };

    const usarLocalizacaoAtual = () => {
        if (!navigator.geolocation) {
            alert("Geolocalização não é suportada.");
            return;
        }

        setCarregando(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const enderecoReal = await obterEnderecoPorCoordenadas(lat, lng);

                setPreviewLocal({
                    endereco: enderecoReal,
                    coords: { lat, lng }
                });
                setCarregando(false);
            },
            () => {
                alert("Erro ao obter localização via GPS.");
                setCarregando(false);
            }
        );
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setCarregando(true);
        const enderecoReal = await obterEnderecoPorCoordenadas(lat, lng);
        setPreviewLocal({
            endereco: enderecoReal,
            coords: { lat, lng }
        });
        setCarregando(false);
    };

    return (
        // Alterado para z-[1000] para garantir isolamento total
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">Definir Localização</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    
                    {/* Input com Autocomplete */}
                    <div className="relative">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Digite a praia, rua ou cidade..." 
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                onFocus={() => sugestoes.length > 0 && setMostrarSugestoes(true)}
                                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#FF7620] outline-none text-[#0A4F6E] font-medium"
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                            {carregando && <Loader2 className="absolute right-4 top-3.5 text-gray-400 animate-spin" size={18} />}
                        </div>

                        {/* CORREÇÃO AQUI: z-[1010] faz a lista flutuar acima dos botões de zoom do Leaflet */}
                        {mostrarSugestoes && sugestoes.length > 0 && (
                            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto z-[1010]">
                                {sugestoes.map((sug, index) => (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            onClick={() => selecionarSugestao(sug)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs text-[#0A4F6E] border-b border-gray-50 last:border-0 flex items-start gap-2 transition-colors"
                                        >
                                            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                            <span className="truncate">{sug.display_name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        {/* Camada invisível de fechamento ajustada */}
                        {mostrarSugestoes && (
                            <div className="fixed inset-0 z-[1005]" onClick={() => setMostrarSugestoes(false)} />
                        )}
                    </div>

                    <button 
                        onClick={usarLocalizacaoAtual}
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#1398D4] text-[#1398D4] rounded-xl font-bold hover:bg-blue-50 transition-all text-sm"
                    >
                        <Navigation size={18} className={carregando ? "animate-spin" : ""} />
                        {carregando ? "Buscando endereço real..." : "Usar minha localização atual"}
                    </button>

                    <div className="relative h-56 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-inner">
                        <MapaCaptura 
                            lat={previewLocal.coords.lat} 
                            lng={previewLocal.coords.lng} 
                            onChangeCoords={handleMapClick} 
                        />
                        
                        <div className="absolute bottom-3 left-3 right-3 z-[500] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2">
                            <MapPin size={14} className="text-red-500 shrink-0" />
                            <span className="text-[11px] font-bold text-[#0A4F6E] line-clamp-1">
                                {previewLocal.endereco}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 relative z-10">
                        <button 
                            onClick={onClose} 
                            className="order-2 md:order-1 flex-1 px-4 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => {
                                onSave(previewLocal);
                                onClose();
                            }}
                            className="order-1 md:order-2 flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg transition-all"
                        >
                            Confirmar Local
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};