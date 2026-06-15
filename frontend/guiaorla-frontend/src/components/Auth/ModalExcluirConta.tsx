"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useDeleteAccount } from "@/hooks/mutations/useDeleteAccount";
import { signOut } from "next-auth/react";

interface ModalExcluirContaProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string; 
}

export function ModalExcluirConta({ isOpen, onClose, userId }: ModalExcluirContaProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { mutateAsync: deleteAccount, isPending } = useDeleteAccount(userId);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await deleteAccount();
            setSuccessMessage("Conta excluída com sucesso. Redirecionando...");
            
            // Aguarda 2 segundinhos para o usuário ler a mensagem e desloga ele
            setTimeout(async () => {
                await signOut({ callbackUrl: "/" }); // Desloga e manda pra Home
            }, 2000);
            
        } catch (error: any) {
            const msg = error.response?.data?.Message || "Erro ao excluir a conta. Tente novamente.";
            setErrorMessage(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Excluir Conta
                    </h3>
                    <button onClick={onClose} disabled={isPending || !!successMessage} className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                
                <div className="p-6 flex flex-col gap-4 text-center">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-2">
                        <p className="text-sm text-red-800 font-medium">
                            Atenção: Esta ação é irreversível. O seu perfil e todos os dados do seu negócio não ficarão mais visíveis no GuiaOrlaPE.
                        </p>
                    </div>

                    <p className="text-gray-700 font-medium mb-4">
                        Tem certeza que deseja excluir sua conta definitivamente?
                    </p>

                    {errorMessage && (
                        <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-left">
                            {errorMessage}
                        </p>
                    )}
                    {successMessage && (
                        <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 text-left">
                            {successMessage}
                        </p>
                    )}

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={onClose}
                            disabled={isPending || !!successMessage}
                            className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isPending || !!successMessage}
                            className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all disabled:opacity-50 disabled:hover:bg-red-600 flex items-center justify-center"
                        >
                            {isPending ? "Excluindo..." : "Sim, Excluir Conta"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}