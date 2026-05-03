

"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MenuCategoriasMobileProps {
  categorias: string[];
  categoriaAtiva: string;
  onSelect: (cat: string) => void;
}

export const MenuCategoriasMobile = ({ categorias, categoriaAtiva, onSelect }: MenuCategoriasMobileProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-0.5 text-white text-[9px] xs:text-[10px] font-bold hover:underline transition-all"
      >
        <span>Categorias</span>
        {isOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-8 right-0 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelect(cat);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-[10px] font-bold transition-colors
                  ${categoriaAtiva === cat 
                    ? "bg-[#0A4F6E] text-white" 
                    : "text-[#0A4F6E] hover:bg-blue-50"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};