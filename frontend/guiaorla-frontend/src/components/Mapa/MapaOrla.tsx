"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção obrigatória para o ícone padrão do Leaflet aparecer no Next.js
const iconePadrao = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapaProps {
    negocios: any[];
}

// 🪄 COMPONENTE MÁGICO PARA AJUSTAR A CÂMARA AUTOMATICAMENTE
function AjustarCamera({ negocios }: { negocios: any[] }) {
    const map = useMap();

    useEffect(() => {
        // Filtra apenas os negócios que têm coordenadas válidas
        const locaisValidos = negocios.filter(n => n.latitude && n.longitude && (n.latitude !== 0 || n.longitude !== 0));
        
        if (locaisValidos.length > 0) {
            // Cria uma "caixa" invisível (bounds) que engloba todas as coordenadas
            const bounds = L.latLngBounds(locaisValidos.map(n => [n.latitude, n.longitude]));
            
            // Manda o mapa focar nessa caixa. 
            // O padding dá um respiro nas bordas, e o maxZoom evita que chegue muito perto se houver apenas 1 pin.
            map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
        }
    }, [negocios, map]);

    return null; // Este componente não renderiza nada visualmente, apenas manipula o mapa
}

export default function MapaOrla({ negocios }: MapaProps) {
    // Centro padrão (fallback) caso ainda não existam negócios cadastrados
    const centroPadrao: [number, number] = [-8.3312, -34.9466];

    return (
        <div className="w-full h-full rounded-xl overflow-hidden relative z-10">
            <MapContainer 
                center={centroPadrao} 
                zoom={14} 
                scrollWheelZoom={true} 
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* O nosso ajustador de câmara entra aqui */}
                <AjustarCamera negocios={negocios} />

                {negocios.map((negocio) => {
                    const lat = negocio.latitude;
                    const lng = negocio.longitude;

                    // Ignora negócios sem coordenadas válidas
                    if (!lat || !lng || (lat === 0 && lng === 0)) return null;

                    return (
                        <Marker key={negocio.id} position={[lat, lng]} icon={iconePadrao}>
                            <Popup className="rounded-xl overflow-hidden">
                                <div className="text-center w-36 pb-1">
                                    <div className="w-full h-20 relative rounded-t-sm overflow-hidden mb-2 bg-gray-100">
                                        <img 
                                            src={negocio.cardImageUrl || negocio.img || "/images/fundopraia.jpg"} 
                                            alt={negocio.nome} 
                                            className="object-cover w-full h-full" 
                                        />
                                    </div>
                                    <strong className="text-[#0A4F6E] text-[13px] block leading-tight px-1">
                                        {negocio.nome}
                                    </strong>
                                    <p className="text-[10px] text-gray-500 m-0 mt-1 truncate px-1">
                                        {negocio.desc}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}