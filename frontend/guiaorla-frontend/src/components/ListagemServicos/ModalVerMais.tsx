"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { X, MapPin, CreditCard, ChevronRight, ExternalLink, Clock } from "lucide-react";

interface ModalVerMaisProps {
  item: any;
  onClose: () => void;
  isEmpreendedor?: boolean;
}

const obterImagemValida = (src?: string | null) => {
  if (!src) return "/images/fundopraia.jpg";
  const ehValido = src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
  return ehValido ? src : "/images/fundopraia.jpg";
};

// Limite de caracteres da descrição no modal
const LIMITE_DESCRICAO = 300;

function DescricaoModal({ texto }: { texto: string }) {
  const [expandido, setExpandido] = useState(false);

  const precisaTruncar = texto.length > LIMITE_DESCRICAO;
  const textoExibicao =
    !expandido && precisaTruncar
      ? texto.slice(0, LIMITE_DESCRICAO) + "..."
      : texto;

  return (
    <div>
      {/* break-words + overflow-wrap anywhere evitam qualquer texto vazar para fora */}
      <p
        className="text-gray-600 text-sm italic"
        style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
      >
        &ldquo;{textoExibicao}&rdquo;
      </p>
      {precisaTruncar && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="text-[11px] text-[#1398D4] font-medium mt-1 hover:underline"
        >
          {expandido ? "Ver menos" : "Ler mais"}
        </button>
      )}
    </div>
  );
}

export const ModalVerMais = ({ item, onClose, isEmpreendedor = false }: ModalVerMaisProps) => {
  const { data: session } = useSession();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [item]);

  if (!item) return null;

  const imagemExibicao =
    imgError
      ? "/images/fundopraia.jpg"
      : obterImagemValida(item.cardImageUrl || item.img || item.businessPhotoUrl);

  const usuarioLogadoId = String(
    (session as any)?.user?.id || (session as any)?.id || ""
  );
  const isOwner = Boolean(
    usuarioLogadoId &&
      (String(item.userId) === usuarioLogadoId ||
        String(item.ownerId) === usuarioLogadoId)
  );


  const hrefPerfil = isOwner
    ? "/empreendedor/meu-perfil"
    : `/perfil-publico/${item.id}${isEmpreendedor ? "?role=empreendedor" : ""}`;

  const descricaoTexto = item.description?.trim()
    ? item.description
    : "Nenhuma descrição adicionada pelo estabelecimento.";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0A4F6E]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300 text-left">

        {/* ── Imagem de capa ── */}
        <div className="relative h-56 w-full">
          <Image
            src={imagemExibicao}
            alt={item.nome || "Imagem do estabelecimento"}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition-all"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-left">
            <h2 className="text-white text-2xl font-bold">{item.nome}</h2>
          </div>
        </div>

        {/* ── Conteúdo ── */}
        <div className="p-6 space-y-6">

          {/* Status + Descrição */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  item.aberto ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-[10px] font-bold uppercase ${
                  item.aberto ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.aberto ? "Aberto Agora" : "Fechado no momento"}
              </span>
            </div>

            <h3 className="text-[#0A4F6E] font-bold text-sm mb-1 uppercase tracking-wide">
              Descrição
            </h3>

            {/* Descrição com limite + proteção contra overflow */}
            <DescricaoModal texto={descricaoTexto} />
          </div>

          {/* Infos: horário / local / pagamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Clock size={18} className="text-[#1398D4] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold text-gray-400 uppercase">
                  Horário
                </span>
                <span className="text-[11px] font-medium text-gray-700 italic truncate">
                  {item.horario || "Não informado"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <MapPin size={18} className="text-[#1398D4] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold text-gray-400 uppercase">
                  Local
                </span>
                <span
                  className="text-[11px] font-semibold text-[#0A4F6E] truncate"
                  title={item.desc}
                >
                  {item.desc}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 sm:col-span-2">
              <CreditCard size={18} className="text-[#1398D4] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold text-gray-400 uppercase">
                  Pagamento
                </span>
                <span className="text-[11px] font-medium text-gray-700 italic">
                  {item.aceitaCard
                    ? "Aceita Cartão, Pix e Dinheiro"
                    : "Apenas Pix e Dinheiro"}
                </span>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3 pt-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.desc)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0A4F6E] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#083d55] transition-all shadow-lg shadow-blue-900/10 text-center text-sm"
            >
              Como chegar pelo Maps
              <ChevronRight size={18} />
            </a>

            <Link
              href={hrefPerfil}
              className="w-full bg-gray-100 text-[#0A4F6E] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all border border-gray-200 text-center text-sm"
            >
              {isOwner ? "Editar Meu Perfil" : "Ver perfil completo"}
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
