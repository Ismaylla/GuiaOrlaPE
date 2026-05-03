
"use client";

interface BotaoProps {
  texto: string;
  onClick?: () => void;
  variante?: "azul" | "laranja";
  larguraMax?: string;
}

export const BotaoFormulario = ({ 
  texto, 
  onClick, 
  variante = "azul", 
  larguraMax = "320px" 
}: BotaoProps) => {
  
  const bg = variante === "azul" 
    ? 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' 
    : 'linear-gradient(180deg, #FF7620 0%, #D66017 80%)';

  return (
    <button
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
      style={{ 
        background: bg,
        maxWidth: larguraMax 
      }}
    >
      {texto}
    </button>
  );
};