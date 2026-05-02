"use client";
import Image from "next/image";
import { MapPin, Camera } from "lucide-react";

interface PerfilHeaderProps {
  podeEditar?: boolean;
  onEditCover?: () => void; // Definição da função no contrato
}

export const PerfilHeader = ({ podeEditar = false, onEditCover }: PerfilHeaderProps) => {
  return (
    <div className="bg-white shadow-sm rounded-b-2xl overflow-hidden border-x border-b border-gray-200">
      {/* SEÇÃO DA CAPA */}
      <div className="relative h-[180px] md:h-[300px] w-full bg-gradient-to-r from-gray-200 to-gray-300">
        <Image 
          src="/images/capa-exemplo.jpg" 
          alt="Capa do Estabelecimento" 
          fill 
          className="object-cover"
        />
        
        {/* BOTÃO EDITAR CAPA */}
        {podeEditar && (
          <button 
            type="button"
            onClick={onEditCover} // ESTA LINHA É CRUCIAL: Ela conecta o clique ao estado da MeuPerfilScreen
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold text-[#1398D4] hover:underline transition-all shadow-sm z-10"
          >
            <Camera size={18} />
            <span>Editar fundo</span>
          </button>
        )}
      </div>

      {/* CONTEÚDO DO PERFIL (TEXTOS E FOTO) */}
      <div className="max-w-[1050px] mx-auto px-4 pb-6">
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-5 -mt-10 md:-mt-14">
          
          {/* FOTO DE PERFIL */}
          <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden shrink-0 group">
            <Image 
              src="/images/perfil-exemplo.jpg" 
              alt="Foto de Perfil" 
              fill 
              className="object-cover"
            />
            {podeEditar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={24} className="text-white" />
                </div>
            )}
          </div>

          {/* TEXTOS PRINCIPAIS */}
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0A4F6E]">
              Raio de Sol: Cocos e Frutas
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1 font-medium text-sm md:text-base">
              <MapPin size={16} className="text-[#FF7620]" />
              <span>Praia de Gaibu, Cabo de Santo Agostinho</span>
            </div>
          </div>

          {/* BOTÃO WHATSAPP */}
          <div className="flex mb-2">
            <button className="bg-[#FF7620] text-white px-8 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
              <span>Falar no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};