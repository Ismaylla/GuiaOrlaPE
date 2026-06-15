"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { LayoutAuth } from "@/components/Formulario/LayoutAuth";
import { InputCustomizado } from "@/components/Formulario/InputCustomizado";
import { BotaoFormulario } from "@/components/Formulario/BotaoFormulario";
import { ModalEsqueciSenha } from "@/components/Auth/ModalEsqueciSenha";

export default function LoginEmpreendedor() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- Estado do Modal


  const router = useRouter();

  async function handleLogin() {
    try {
      setLoading(true);
      setErro("");

      const response = await signIn("credentials", {
        email,
        password: senha,
        redirect: false,
      });

      if (response?.error) {
        setErro("E-mail ou senha inválidos.");
        return;
      }

      router.push("/empreendedor/explorer");
    } catch (error) {
      setErro("Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
}

  return (
    <LayoutAuth>
      <div className="relative h-40 w-40 mb-2 transition-all">
        <Image
          src="/images/LOGOfundotransparente 3.png"
          alt="GuiaOrlaPE Logo"
          fill
          className="object-contain"
        />
      </div>

      <h2 className="mb-10 text-[28px] font-medium text-[#0A4F6E] text-center">
        Área do Empreendedor
      </h2>

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
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="text-[14px] font-medium text-[#FF904B] hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Renderização do Modal */}
          {isModalOpen && (
            <ModalEsqueciSenha onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </div>

      {erro && (
        <p className="text-red-500 text-sm text-center">
          {erro}
        </p>
      )}
      
      <div className="flex flex-col items-center gap-3 mt-10 w-full">
        <BotaoFormulario 
          texto={loading ? "ENTRANDO..." : "ENTRAR"}
          larguraMax="240px"
          variante="azul"
          onClick={handleLogin}
        />
        
        {/* ROTA ATUALIZADA */}
        <Link 
          href="/empreendedor/cadastro-empreendedor" 
          className="text-[15px] font-medium text-[#FF7620] hover:underline decoration-2 underline-offset-4"
        >
          Criar conta
        </Link>
      </div>
    </LayoutAuth>
  );
}