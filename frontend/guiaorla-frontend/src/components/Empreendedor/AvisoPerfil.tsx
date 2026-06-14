"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { X, AlertCircle } from "lucide-react";

export const AvisoPerfil = () => {
    const { data: session, status } = useSession();
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPerfil = async () => {
            if (status !== "authenticated" || !session) {
                setIsLoading(false);
                return;
            }

            // Se o usuário fechou o banner antes, não mostra mais
            const oculto = localStorage.getItem("aviso_boas_vindas_oculto");
            if (oculto === "true") {
                setIsLoading(false);
                return;
            }

            try {
                const token = (session as any).accessToken || (session as any).token;
                const response = await fetch(`http://localhost:5148/api/business/user?t=${new Date().getTime()}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const d = await response.json();
                    // Se faltar vitrine, perfil, capa ou descrição, consideramos incompleto
                    const isIncompleto = !d.cardImageUrl || !d.businessPhotoUrl || !d.coverPhotoUrl || !d.description;
                    if (isIncompleto) setIsVisible(true);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        checkPerfil();
    }, [session, status]);

    const handleDismiss = () => {
        localStorage.setItem("aviso_boas_vindas_oculto", "true");
        setIsVisible(false);
    };

    if (isLoading || !isVisible) return null;

    return (
        <div className="bg-[#E6F4FA] border border-[#B3E0F2] rounded-2xl p-4 mb-6 relative flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="text-[#1398D4] shrink-0 mt-0.5" size={24} />
                <div>
                    <h4 className="text-[#0A4F6E] font-bold text-sm">Complete seu perfil para atrair mais clientes!</h4>
                    <p className="text-gray-600 text-xs mt-1">Notamos que seu estabelecimento ainda não possui fotos ou bio. Perfis completos recebem até 3x mais cliques na orla.</p>
                </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href="/empreendedor/meu-perfil" className="bg-[#0A4F6E] hover:bg-[#083d55] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap text-center flex-1 sm:flex-none shadow-md">
                    Completar agora
                </Link>
                <button onClick={handleDismiss} className="p-2 text-gray-400 hover:text-[#0A4F6E] hover:bg-white/50 rounded-full transition-colors absolute top-2 right-2 sm:static">
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};