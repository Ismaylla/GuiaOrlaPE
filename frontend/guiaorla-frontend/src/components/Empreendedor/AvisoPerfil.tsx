"use client";
import { API_URL } from "@/lib/config";
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

            try {
                const token = (session as any).accessToken || (session as any).token;
                const response = await fetch(`${API_URL}/api/business/user?t=${new Date().getTime()}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const d = await response.json();
                    
                    // Lógica rigorosa de preenchimento (mesma do BarraProgresso)
                    const isIncompleto = 
                        !d.cardImageUrl || 
                        !d.businessPhotoUrl || 
                        !d.coverPhotoUrl || 
                        !d.description || 
                        !d.address || 
                        d.serviceType === 0;

                    setIsVisible(isIncompleto);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        checkPerfil();
    }, [session, status]);

    // Removemos o handleDismiss e o localStorage para ele sempre reavaliar
    if (isLoading || !isVisible) return null;

    return (
        <div className="bg-[#E6F4FA] border border-[#B3E0F2] rounded-2xl p-4 mb-6 relative flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="text-[#1398D4] shrink-0 mt-0.5" size={24} />
                <div>
                    <h4 className="text-[#0A4F6E] font-bold text-sm">Complete seu perfil!</h4>
                    <p className="text-gray-600 text-xs mt-1">Perfis 100% preenchidos recebem até 3x mais cliques.</p>
                </div>
            </div>
            <Link href="/empreendedor/meu-perfil" className="bg-[#0A4F6E] hover:bg-[#083d55] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md">
                Completar agora
            </Link>
        </div>
    );
};