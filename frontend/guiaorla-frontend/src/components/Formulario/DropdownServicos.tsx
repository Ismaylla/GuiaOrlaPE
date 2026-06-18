"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BusinessServiceTypeEnum } from "@/interfaces/businessRequest";


interface DropdownProps {
    label: React.ReactNode;
    selected?: BusinessServiceTypeEnum;
    onSelect: (opcao: BusinessServiceTypeEnum) => void;
}

const serviceOptions = [
    {
        label: "Barracas e Ambulantes",
        value: BusinessServiceTypeEnum.BarracasEAmbulantes,
    },
    {
        label: "Passeios e Lazer",
        value: BusinessServiceTypeEnum.PasseiosELazer,
    },
    {
        label: "Bares e Restaurantes",
        value: BusinessServiceTypeEnum.BaresERestaurantes,
    },
    {
        label: "Artesanato Local",
        value: BusinessServiceTypeEnum.ArtesanatoLocal,
    },
    {
        label: "Comércio e Serviços",
        value: BusinessServiceTypeEnum.ComercioEServicos,
    },
];

export const DropdownServicos = ({
    label,
    selected,
    onSelect,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedLabel =
        serviceOptions.find((item) => item.value === selected)?.label ||
        "Selecione...";

    return (
        <div className="flex flex-col gap-1 relative z-50">
            <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-11 w-full rounded-full bg-white px-6 shadow-md flex items-center justify-between text-[#0A4F6E] focus:outline-none"
                style={{
                    boxShadow: "0px 4px 6px rgba(10, 79, 110, 0.8)",
                }}
            >
                <span
                    className={`${
                        !selected
                            ? "text-gray-400"
                            : "text-[#0A4F6E]"
                    } font-normal`}
                >
                    {selectedLabel}
                </span>

                <ChevronDown
                    className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    size={20}
                />
            </button>

            <div
                className={`
                    absolute top-[85px] w-full bg-white rounded-[25px]
                    shadow-xl border border-gray-100 overflow-hidden z-50
                    transition-all duration-300 ease-in-out origin-top
                    ${
                        isOpen
                            ? "opacity-100 scale-y-100"
                            : "opacity-0 scale-y-0 pointer-events-none"
                    }
                `}
            >
                {serviceOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                            onSelect(option.value);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-6 py-3 text-[#0A4F6E] font-normal hover:bg-[#DDF4FF] transition-colors border-b border-gray-100 last:border-none"
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};