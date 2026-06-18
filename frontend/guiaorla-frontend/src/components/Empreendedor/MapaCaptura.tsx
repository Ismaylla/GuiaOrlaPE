"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Importa o CSS do Leaflet para o mapa não vir quebrado
import "leaflet/dist/leaflet.css";

// Correção para os ícones padrão do Leaflet que o Next.js costuma quebrar
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapaCapturaProps {
    lat: number;
    lng: number;
    onChangeCoords: (lat: number, lng: number) => void;
}

// Componente interno para escutar cliques no mapa e mover o marcador
const MapEventsHandler = ({ onChangeCoords }: { onChangeCoords: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onChangeCoords(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

// Componente interno para re-centralizar o mapa quando o GPS ou busca mudarem as coordenadas de fora
const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

export const MapaCaptura = ({ lat, lng, onChangeCoords }: MapaCapturaProps) => {
    const posicao: [number, number] = [lat, lng];

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden z-10">
            <MapContainer 
                center={posicao} 
                zoom={15} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={posicao} icon={defaultIcon} />
                <MapEventsHandler onChangeCoords={onChangeCoords} />
                <ChangeView center={posicao} />
            </MapContainer>
        </div>
    );
};