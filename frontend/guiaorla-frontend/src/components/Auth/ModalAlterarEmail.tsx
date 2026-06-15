"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUpdateEmail } from "@/hooks/mutations/useUpdateEmail";

interface ModalAlterarEmailProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string; 
}

export function ModalAlterarEmail({ isOpen, onClose, userId }: ModalAlterarEmailProps) {
    const [newEmail, setNewEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Chama o nosso hook passando o ID do usuário
    const { mutateAsync: updateEmail, isPending } = useUpdateEmail(userId);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!newEmail) {
            setErrorMessage("Por favor, digite um novo e-mail.");
            return;
        }

        try {
            await updateEmail(newEmail);
            setSuccessMessage("E-mail atualizado com sucesso! Faça login novamente.");
            setNewEmail("");
            
            // Fecha o modal automaticamente após alguns segundos
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error: any) {
            const msg = error.response?.data?.Message || "Erro ao atualizar o e-mail. Tente novamente.";
            setErrorMessage(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Header do Modal */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#0A4F6E]">Alterar E-mail</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                
                {/* Corpo e Formulário */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Novo E-mail
                        </label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-50 bg-gray-50/50 focus:bg-blue-50/30 focus:border-[#1398D4] outline-none transition-all text-sm text-gray-800"
                            placeholder="exemplo@email.com"
                            disabled={isPending || !!successMessage}
                        />
                    </div>

                    {/* Mensagens de Feedback */}
                    {errorMessage && (
                        <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                            {errorMessage}
                        </p>
                    )}
                    {successMessage && (
                        <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                            {successMessage}
                        </p>
                    )}

                    {/* Botão de Salvar */}
                    <button
                        type="submit"
                        disabled={isPending || !!successMessage}
                        className="w-full mt-2 px-4 py-3 rounded-xl font-bold text-white bg-[#0A4F6E] hover:bg-[#083d55] shadow-lg transition-all disabled:opacity-50 disabled:hover:bg-[#0A4F6E] flex items-center justify-center"
                    >
                        {isPending ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </div>
        </div>
    );
}