
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function CadastroEmpreendedor() {
  const [step, setStep] = useState(1);
  
  // Estados para visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Navegação entre passos
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <main className="flex min-h-screen w-full bg-[#ECF9FF] overflow-hidden font-sans">
      
      {/* LADO ESQUERDO: Imagem com a Curva */}
      <div className="relative hidden lg:block w-[40%] h-screen overflow-hidden rounded-br-[500px] z-20"
           style={{ filter: 'drop-shadow(4px 4px 100px rgba(117, 179, 198, 1))' }}>
        <Image
          src="/images/fundopraia.jpg" 
          alt="Praia de Pernambuco"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* LADO DIREITO: Conteúdo */}
      <div className="relative flex w-full flex-col items-center lg:w-[60%] px-8 pt-4 pb-10 overflow-y-auto">
        
        {/* BOTÃO VOLTAR: Posicionado no topo esquerdo da área de conteúdo */}
        <button 
          onClick={() => step > 1 ? prevStep() : window.history.back()}
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

        {/* LOGO: Canto superior direito */}
        <div className="absolute top-4 right-4 h-28 w-28 transition-all">
          <Image src="/images/LOGOfundotransparente 3.png" alt="Logo" fill className="object-contain" />
        </div>

        {/* Título e Passo */}
        <div className="text-center mt-12 mb-8">
          <h2 className="text-[32px] font-medium text-[#0A4F6E]">Cadastro do Empreendedor</h2>
          <p className="text-[16px] text-[#0A4F6E] opacity-80">Passo {step} de 4</p>
        </div>

        {/* Formulário (Largura padrão 450px) */}
        <div className="flex w-full max-w-[450px] flex-col gap-4">
          
          {step === 1 && (
            <div className="flex flex-col gap-4">
              
              {/* Nome */}
              <div className="flex flex-col gap-1">
                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Nome Completo ou do Negócio</label>
                <input className="h-11 w-full rounded-full bg-white px-6 focus:outline-none" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
              </div>

              {/* E-mail */}
              <div className="flex flex-col gap-1">
                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">E-mail (Será seu Login)</label>
                <input className="h-11 w-full rounded-full bg-white px-6 focus:outline-none" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
              </div>

              {/* Senha */}
              <div className="flex flex-col gap-1">
                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Crie uma senha</label>
                <div className="relative w-full">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="h-11 w-full rounded-full bg-white px-6 focus:outline-none text-[16px]" 
                    style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B] hover:scale-110 transition-all"
                  >
                    {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="flex flex-col gap-1">
                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Confirme sua senha</label>
                <div className="relative w-full">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-11 w-full rounded-full bg-white px-6 focus:outline-none text-[16px]" 
                    style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B] hover:scale-110 transition-all"
                  >
                    {showConfirmPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                  </button>
                </div>
              </div>

              {/* Whatsapp */}
              <div className="flex flex-col gap-1">
                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Whatsapp ou Telefone</label>
                <input 
                  placeholder="Ex: 87991234567" 
                  className="h-11 w-full rounded-full bg-white px-6 focus:outline-none placeholder:text-gray-400" 
                  style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} 
                />
              </div>

              {/* Botão Próximo */}
              <div className="flex justify-center mt-8 pb-10">
                <button 
                  onClick={nextStep}
                  className="h-12 w-64 rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' }}
                >
                  PRÓXIMO
                </button>
              </div>
            </div>
          )}

          {/* Espaço reservado para os próximos passos */}
          {step > 1 && (
            <div className="flex flex-col items-center gap-4 mt-10 text-[#0A4F6E]">
              <p className="font-medium">Conteúdo do Passo {step} em breve...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}