"use client";

import { API_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import { MapPin, Camera, User, Trash2 } from "lucide-react";

interface PerfilHeaderProps {
  podeEditar?: boolean;
  onEditCover?: () => void;
  onEditProfile?: () => void;
  onDeleteCover?: () => void;
  onDeleteProfile?: () => void;
  nomeNegocio?: string;
  fotoCapa?: string;
  fotoPerfil?: string;
  localizacao?: string;
  telefone?: string;
}

const obterImagemValida = (src: string | undefined) => {
  if (!src) return "";
  const limpo = src.trim();
  if ( limpo === "" || limpo === API_URL || limpo === `${API_URL}/`) {
      return "";
  }
  return limpo;
};

export const PerfilHeader = ({
  podeEditar = false,
  onEditCover,
  onEditProfile,
  onDeleteCover,
  onDeleteProfile,
  nomeNegocio,
  fotoCapa,
  fotoPerfil,
  localizacao,
  telefone
}: PerfilHeaderProps) => {

  const [capaQuebrada, setCapaQuebrada] = useState(false);
  const [perfilQuebrado, setPerfilQuebrado] = useState(false);

  useEffect(() => { setCapaQuebrada(false); }, [fotoCapa]);
  useEffect(() => { setPerfilQuebrado(false); }, [fotoPerfil]);

  const imagemCapaOriginal = obterImagemValida(fotoCapa);
  const imagemPerfilOriginal = obterImagemValida(fotoPerfil);

  const imagemCapaExibir = capaQuebrada ? "" : imagemCapaOriginal;
  const imagemPerfilExibir = perfilQuebrado ? "" : imagemPerfilOriginal;

  const handleWhatsApp = () => {
    if (!telefone) return;
    const numeroLimpo = telefone.replace(/\D/g, '');
    const mensagem = `Olá! Gostaria de saber mais sobre a ${nomeNegocio || 'sua empresa'}.`;
    window.open(`https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const nomeExibicao = nomeNegocio || "Raio de Sol: Cocos e Frutas";
  const localizacaoExibicao = localizacao || "Praia de Gaibu, Cabo de Santo Agostinho";

  return (
    <div className="bg-white shadow-sm rounded-b-2xl overflow-hidden border-x border-b border-gray-200 relative z-0">
      {/* SEÇÃO DA CAPA */}
      <div className="relative h-[180px] md:h-[300px] w-full bg-gradient-to-r from-gray-200 to-gray-300">
        {imagemCapaExibir ? (
            <img
              src={imagemCapaExibir}
              alt={`Capa de ${nomeExibicao}`}
              className="w-full h-full object-cover absolute inset-0 z-0"
              onError={() => setCapaQuebrada(true)} 
            />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300" />
        )}

        {podeEditar && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
            {imagemCapaExibir && (
              <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteCover?.();
                }}
                className="bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm cursor-pointer"
                title="Remover fundo"
              >
                <Trash2 size={18} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditCover?.();
              }}
              className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold text-[#1398D4] hover:underline transition-all shadow-sm cursor-pointer"
            >
              <Camera size={18} />
              <span>{imagemCapaExibir ? "Trocar fundo" : "Editar fundo"}</span>
            </button>
          </div>
        )}
      </div>

      {/* CONTEÚDO DO PERFIL */}
      <div className="max-w-[1050px] mx-auto px-4 pb-6 relative">
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-5 -mt-10 md:-mt-14">
          <div
            className="relative h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden shrink-0 group"
            style={{ lineHeight: 0 }}
          >
            {imagemPerfilExibir && (
              <img
                src={imagemPerfilExibir}
                alt="Foto de Perfil"
                className="w-full h-full object-cover block relative z-0"
                onError={() => setPerfilQuebrado(true)}
              />
            )}
            
            <div className={`absolute inset-0 flex items-center justify-center bg-gray-200 z-0 ${imagemPerfilExibir ? 'hidden' : ''}`}>
              <User size={58} strokeWidth={1.7} className="text-gray-500" />
            </div>

            {podeEditar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEditProfile?.(); }}
                  className="text-white hover:scale-110 transition-transform flex flex-col items-center gap-1"
                  title="Trocar foto"
                >
                  <Camera size={22} />
                </button>

                {imagemPerfilExibir && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteProfile?.(); }}
                      className="text-white hover:text-red-500 hover:scale-110 transition-all flex flex-col items-center gap-1"
                      title="Remover foto"
                    >
                      <Trash2 size={22} />
                    </button>
                )}
              </div>
            )}
          </div>
          
          {/* AJUSTE AQUI: Melhor alinhamento Flexbox para título, local e botão */}
          <div className="flex-1 flex flex-col md:flex-row items-center md:items-center justify-between w-full md:pb-2 gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A4F6E]">{nomeExibicao}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1 font-medium text-sm md:text-base">
                <MapPin size={16} className="text-[#FF7620] shrink-0" />
                <span className="line-clamp-1">{localizacaoExibicao}</span>
              </div>
            </div>

            {!podeEditar && telefone && (
              <button 
                onClick={handleWhatsApp}
                className="bg-[#FF7620] text-white px-8 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                Falar no WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};