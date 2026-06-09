"use client";
import Image from "next/image";
import { MapPin, Camera } from "lucide-react";

interface PerfilHeaderProps {
  podeEditar?: boolean;
  onEditCover?: () => void; 
  nomeNegocio?: string;
  fotoCapa?: string;
  localizacao?: string;
}

// FUNÇÃO DE SEGURANÇA PARA EVITAR QUE STRINGS INVÁLIDAS QUEBREM A IMAGEM DE CAPA
const obterCapaValida = (src: string | undefined) => {
  if (!src) return "/images/capa-exemplo.jpg";
  const ehValido = src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
  return ehValido ? src : "/images/capa-exemplo.jpg";
};

export const PerfilHeader = ({ 
  podeEditar = false, 
  onEditCover,
  nomeNegocio,
  fotoCapa,
  localizacao 
}: PerfilHeaderProps) => {

  // Aplicando a trava de segurança na imagem vinda do banco
  const imagemCapa = obterCapaValida(fotoCapa);
  const nomeExibicao = nomeNegocio || "Raio de Sol: Cocos e Frutas";
  const localizacaoExibicao = localizacao || "Praia de Gaibu, Cabo de Santo Agostinho";

  return (
    <div className="bg-white shadow-sm rounded-b-2xl overflow-hidden border-x border-b border-gray-200">
      {/* SEÇÃO DA CAPA */}
      <div className="relative h-[180px] md:h-[300px] w-full bg-gradient-to-r from-gray-200 to-gray-300">
        <Image 
          src={imagemCapa} 
          alt={`Capa de ${nomeExibicao}`} 
          fill 
          className="object-cover"
        />
        
        {/* BOTÃO EDITAR CAPA */}
        {podeEditar && (
          <button 
            type="button"
            onClick={onEditCover} 
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
          </div>

          {/* TEXTOS PRINCIPAIS */}
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0A4F6E]">
              {nomeExibicao}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1 font-medium text-sm md:text-base">
              <MapPin size={16} className="text-[#FF7620]" />
              <span>{localizacaoExibicao}</span>
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