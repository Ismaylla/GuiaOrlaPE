// src/components/Formulario/BotaoVoltar.tsx
"use client";
import Image from "next/image";

interface BotaoVoltarProps {
    onClick: () => void;
}

export const BotaoVoltar = ({ onClick }: BotaoVoltarProps) => {
    return (
        <button
            onClick={onClick}
            className="absolute top-8 left-[30px] transition-all hover:scale-110 active:scale-95 z-50"
        >
            <Image
                src="/icons/SetaBack.svg"
                alt="Voltar"
                width={60}
                height={60}
                priority
            />
        </button>
    );
};