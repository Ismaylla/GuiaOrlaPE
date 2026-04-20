
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { LayoutAuth } from "@/components/Formulario/LayoutAuth";
import { InputCustomizado } from "@/components/Formulario/InputCustomizado";
import { BotaoFormulario } from "@/components/Formulario/BotaoFormulario";

export default function LoginEmpreendedor() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <LayoutAuth>
      
      {/* 1. LOGO NO TOPO */}
      <div className="relative h-40 w-40 mb-2 transition-all">
        <Image
          src="/images/LOGOfundotransparente 3.png"
          alt="GuiaOrlaPE Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* 2. TÍTULO ABAIXO DA LOGO */}
      <h2 className="mb-10 text-[28px] font-medium text-[#0A4F6E] text-center">
        Área do Empreendedor
      </h2>

      {/* 3. FORMULÁRIO */}
      <div className="flex flex-col gap-4 w-full">
        <InputCustomizado 
          label="E-mail" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-1 w-full">
          <InputCustomizado 
            label="Senha" 
            type="password" 
            showPasswordOption 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          
          <div className="flex justify-between items-center px-4 mt-1">
            <button className="text-[14px] font-medium text-[#FF904B] hover:underline">
              Esqueci minha senha
            </button>
          </div>
        </div>
      </div>

      {/* 4. BOTÕES */}
      <div className="flex flex-col items-center gap-3 mt-10 w-full">
        <BotaoFormulario 
          texto="ENTRAR" 
          larguraMax="240px" 
        />
        
        <Link 
          href="/cadastro-empreendedor" 
          className="text-[15px] font-medium text-[#0A4F6E] hover:underline decoration-2 underline-offset-4"
        >
          Criar conta
        </Link>
      </div>

    </LayoutAuth>
  );
}