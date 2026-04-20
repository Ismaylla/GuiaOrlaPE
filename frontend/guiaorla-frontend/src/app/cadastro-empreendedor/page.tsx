"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

import { LayoutAuth } from "@/components/Formulario/LayoutAuth";
import { InputCustomizado } from "@/components/Formulario/InputCustomizado";
import { BotaoFormulario } from "@/components/Formulario/BotaoFormulario";
import { DropdownServicos } from "@/components/Formulario/DropdownServicos";
import { BotaoVoltar } from "@/components/Formulario/BotaoVoltar";

export default function CadastroEmpreendedor() {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState("Selecione...");

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <LayoutAuth>
            <BotaoVoltar onClick={() => step > 1 ? prevStep() : window.history.back()} />

            <div className="absolute top-4 right-4 h-28 w-28">
                <Image src="/images/LOGOfundotransparente 3.png" alt="Logo" fill className="object-contain" />
            </div>

            <div className="text-center mt-12 mb-8">
                <h2 className="text-[32px] font-medium text-[#0A4F6E]">Cadastro do Empreendedor</h2>
                <p className="text-[16px] text-[#0A4F6E] opacity-80">Passo {step} de 3</p>
            </div>

            <div className="flex w-full max-w-[450px] flex-col">
                {/* Aumentei a altura para h-[480px]. 
                  Isso empurra o botão mais para baixo e garante que ele não se mova.
                */}
                <div className="h-[480px] w-full flex flex-col justify-start">
                    
                    {/* PASSO 1: DADOS BÁSICOS */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-500">
                            <InputCustomizado label="Nome Completo ou do Negócio" />
                            <InputCustomizado label="E-mail (Será seu Login)" type="email" />
                            <InputCustomizado label="Crie uma senha" type="password" showPasswordOption />
                            <InputCustomizado label="Confirme sua senha" type="password" showPasswordOption />
                            <InputCustomizado label="Whatsapp ou Telefone" placeholder="Ex: 87991234567" />
                        </div>
                    )}

                    {/* PASSO 2: SERVIÇO E LOCALIZAÇÃO */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500">
                            <DropdownServicos 
                                label="Qual serviço você oferece?" 
                                selected={selectedService} 
                                onSelect={setSelectedService} 
                            />
                            <InputCustomizado label="Endereço ou Ponto de Referência" placeholder="Ex: Av. Beira Mar, Gaibu" />
                            <button className="text-left ml-4 mt-[-10px] text-[13px] font-semibold text-[#FF904B] hover:underline">
                                Usar minha localização atual
                            </button>
                            <div className="relative mt-2 w-full h-[180px] rounded-2xl bg-gray-200 overflow-hidden border border-gray-300">
                                <Image src="/images/mapa-mockup.png" alt="Mapa" fill className="object-cover opacity-30 grayscale" />
                                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                    <div className="bg-[#FF904B] text-white text-[10px] px-2 py-1 rounded-md mb-1 font-bold italic">É aqui?</div>
                                    <div className="h-6 w-6 bg-[#FF904B] rounded-full border-2 border-white shadow-lg"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PASSO 3: FOTO E TERMOS */}
                    {step === 3 && (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-right duration-500 w-full">
                            <h3 className="text-[22px] font-medium text-[#0A4F6E] leading-tight text-center">Adicione uma foto do seu negócio</h3>
                            <div className="relative w-full h-[200px] rounded-2xl bg-white border-2 border-dashed border-[#1398D4] flex flex-col items-center justify-center gap-3 cursor-pointer">
                                <Image src="/icons/CamUpload.svg" alt="Upload" width={60} height={60} />
                                <p className="text-[#FF904B] font-semibold text-[14px] underline">Faça Upload da imagem aqui</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="h-6 w-6 rounded border-2 border-[#0A4F6E] checked:bg-[#0A4F6E]" />
                                    <span className="text-[#0A4F6E] text-[15px] font-medium">Li e aceito os Termos de Uso</span>
                                </label>
                                <Link href="/termos" className="text-[#FF904B] font-bold text-[15px] underline">Termos de Uso</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTÃO FIXO: mt-4 para dar o toque final de distância */}
                <div className="flex justify-center mt-4">
                    <BotaoFormulario 
                        texto={step === 3 ? "FINALIZAR CADASTRO" : "PRÓXIMO"} 
                        onClick={step === 3 ? () => console.log("Fim") : nextStep} 
                    />
                </div>
            </div>
        </LayoutAuth>
    );
}