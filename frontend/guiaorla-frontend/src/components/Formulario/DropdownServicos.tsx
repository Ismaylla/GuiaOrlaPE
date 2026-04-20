// src/components/Formulario/DropdownServicos.tsx
"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
    label: string;
    selected: string;
    onSelect: (opcao: string) => void;
}

export const DropdownServicos = ({ label, selected, onSelect }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const opcoes = ["Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"];

    return (
        <div className="flex flex-col gap-1 relative z-50">
            <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-11 w-full rounded-full bg-white px-6 shadow-md flex items-center justify-between text-[#0A4F6E] focus:outline-none"
                style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
            >
                <span className={`${selected === "Selecione..." ? "text-gray-400" : "text-[#0A4F6E]"} font-normal`}>
                    {selected}
                </span>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} />
            </button>

            <div className={`
                absolute top-[85px] w-full bg-white rounded-[25px] shadow-xl border border-gray-100 overflow-hidden z-50
                transition-all duration-300 ease-in-out origin-top
                ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}
            `}>
                {opcoes.map((opcao) => (
                    <button
                        key={opcao}
                        type="button"
                        onClick={() => { onSelect(opcao); setIsOpen(false); }}
                        className="w-full text-left px-6 py-3 text-[#0A4F6E] font-normal hover:bg-[#DDF4FF] transition-colors border-b border-gray-100 last:border-none"
                    >
                        {opcao}
                    </button>
                ))}
            </div>
        </div>
    );
};