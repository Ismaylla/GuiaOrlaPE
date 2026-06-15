// import { useState } from 'react';
// import { useForgotPassword } from '@/hooks/mutations/useForgotPassword';

// export const ModalEsqueciSenha = ({ onClose }: { onClose: () => void }) => {
//   const [email, setEmail] = useState('');
//   const { mutate, isPending } = useForgotPassword();

//   const handleSubmit = () => {
//     mutate(email, {
//       onSuccess: () => {
//         alert("E-mail enviado com sucesso! Verifique sua caixa de entrada.");
//         onClose();
//       },
//       onError: () => alert("Erro ao enviar. Verifique se o e-mail está correto."),
//     });
//   };

//   return (
//     <div className="modal-container">
//       <h2>Esqueci minha senha</h2>
//       <input 
//         type="email" 
//         placeholder="Digite seu e-mail" 
//         value={email} 
//         onChange={(e) => setEmail(e.target.value)} 
//       />
//       <button onClick={handleSubmit} disabled={isPending}>
//         {isPending ? 'Enviando...' : 'Enviar Nova Senha'}
//       </button>
//       <button onClick={onClose}>Cancelar</button>
//     </div>
//   );
// };

"use client";
import { useState } from "react";
import { X, Mail } from "lucide-react";
import { useForgotPassword } from "@/hooks/mutations/useForgotPassword";

interface ModalEsqueciSenhaProps {
  onClose: () => void;
}

export const ModalEsqueciSenha = ({ onClose }: ModalEsqueciSenhaProps) => {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useForgotPassword();

  const handleSubmit = () => {
    mutate(email, {
      onSuccess: () => {
        alert("E-mail enviado com sucesso! Verifique sua caixa de entrada.");
        onClose();
      },
      onError: () => alert("Erro ao enviar. Verifique se o e-mail está correto."),
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm text-[#0A4F6E]"><Mail size={20} /></div>
            <h3 className="font-bold text-[#0A4F6E]">Recuperar Senha</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Digite seu e-mail cadastrado e enviaremos uma senha temporária para você.
          </p>
          <input
            type="email"
            placeholder="seu-email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#1398D4] outline-none transition-all"
          />
        </div>

        {/* Rodapé */}
        <div className="p-6 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-4 bg-[#0A4F6E] text-white rounded-2xl font-bold shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all hover:bg-[#083d55] disabled:opacity-50"
          >
            {isPending ? "ENVIANDO..." : "ENVIAR NOVA SENHA"}
          </button>
        </div>
      </div>
    </div>
  );
};