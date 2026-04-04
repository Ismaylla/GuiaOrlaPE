"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginEmpreendedor() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen w-full bg-[#ECF9FF] overflow-hidden font-sans">
      
      {/* LADO ESQUERDO: Imagem ajustada (40% da tela) */}
      <div 
        className="relative hidden lg:block w-[40%] h-screen overflow-hidden rounded-br-[500px] z-20"
        style={{ 
          filter: 'drop-shadow(4px 4px 100px rgba(117, 179, 198, 1))' 
        }}
      >
        <Image
          src="/images/fundopraia.jpg" 
          alt="Praia de Pernambuco"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* LADO DIREITO: Formulário (60% da tela) */}
<div className="flex w-full flex-col items-center justify-center lg:w-[60%] px-8 pb-12 overflow-y-auto">
  
  {/* Logo: Ajustada para h-40 para não empurrar muito o resto */}
  <div className="relative h-40 w-40 mb-2 mt-10 transition-all">
    <Image
      src="/images/LOGOfundotransparente 3.png"
      alt="GuiaOrlaPE Logo"
      fill
      className="object-contain"
    />
  </div>

  {/* Área do Empreendedor: Reduzi a margem de 50px para 30px */}
  <h2 className="mt-[px] mb-[70px] text-[28px] font-medium text-[#0A4F6E]">
    Área do Empreendedor
  </h2>

  {/* Form: Mudei de max-w-md (448px) para max-w-[340px] para ficar mais compacto */}
  <div className="flex w-full max-w-[450px] flex-col gap-4">
    
    {/* Input E-mail */}
    <div className="flex flex-col gap-1">
      <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">E-mail</label>
      <input 
        type="email" 
        className="h-11 w-full rounded-full border-none bg-white px-6 focus:outline-none focus:ring-2 focus:ring-azul-claro text-[16px]"
        style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
      />
    </div>

    {/* Input Senha */}
    <div className="flex flex-col gap-1">
      <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Senha</label>
      <div className="relative w-full">
        <input 
          type={showPassword ? "text" : "password"} 
          className="h-11 w-full rounded-full border-none bg-white px-6 focus:outline-none focus:ring-2 focus:ring-azul-claro text-[16px]"
          style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B]"
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      
      {/* Links Auxiliares: Mais compactos */}
      <div className="flex justify-between items-center px-4 mt-1">
        <button 
          onClick={() => setShowPassword(!showPassword)}
          className="text-[14px] font-medium text-[#FF904B] hover:underline"
        >
          Mostrar senha
        </button>
        
        <button className="text-[14px] font-medium text-[#FF904B] hover:underline">
          Esqueci minha senha
        </button>
      </div>
    </div>

    {/* Botão Entrar e Criar Conta: Agora com PB-12 no container pai para respirar */}
    <div className="flex flex-col items-center gap-3 mt-10">
      <button 
        className="flex h-11 w-full max-w-[240px] items-center justify-center rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' }}
      >
        ENTRAR
      </button>
      
      <Link 
        href="/cadastro-empreendedor" 
        className="text-[15px] font-medium text-[#0A4F6E] hover:underline decoration-2 underline-offset-4"
      >
        Criar conta
      </Link>
    </div>
  </div>
</div>
    </main>
  );
}