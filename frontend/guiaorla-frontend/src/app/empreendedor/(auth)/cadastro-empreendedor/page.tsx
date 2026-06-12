"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { LayoutAuth } from "@/components/Formulario/LayoutAuth";
import { InputCustomizado } from "@/components/Formulario/InputCustomizado";
import { BotaoFormulario } from "@/components/Formulario/BotaoFormulario";
import { DropdownServicos } from "@/components/Formulario/DropdownServicos";
import { BotaoVoltar } from "@/components/Formulario/BotaoVoltar";
import { useRegisterBusinessperson } from "@/hooks/mutations/useRegisterBusinessperson";
import { CreateBusinesspersonRequest } from "@/interfaces/businessPersonRequest";
import { BusinessServiceTypeEnum } from "@/interfaces/businessRequest";
import { Loader2 } from "lucide-react";

// Carrega o Leaflet apenas do lado do cliente (ignora o SSR do Next.js)
const MapaCaptura = dynamic(
    () => import("@/components/Empreendedor/MapaCaptura").then((mod) => mod.MapaCaptura),
    { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Carregando mapa interativo...</div> }
);

export default function CadastroEmpreendedor() {
    const [step, setStep] = useState(1);
    const [carregandoGps, setCarregandoGps] = useState(false);
    const router = useRouter();

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

    const { mutateAsync, isPending } = useRegisterBusinessperson();

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        businessName: "",
        address: "",
        businessPhotoUrl: "/images/fundopraia.jpg",
        serviceType: BusinessServiceTypeEnum.ArtesanatoLocal,
        // Inicializa com as coordenadas padrão de Gaibu
        latitude: -8.3364,
        longitude: -34.9451,
    });

    async function handleRegister() {
        try {
            if (formData.password !== formData.confirmPassword) {
                alert("As senhas não coincidem");
                return;
            }

            const payload: CreateBusinesspersonRequest = {
                name: formData.userName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                business: {
                    name: formData.businessName,
                    serviceType: formData.serviceType,
                    address: formData.address || "Endereço não informado",
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    businessPhotoUrl: formData.businessPhotoUrl || "teste",
                },
            };

            const createdUser = await mutateAsync(payload);
            console.log("Usuário criado:", createdUser);
            router.push("/empreendedor/login-empreendedor");
        } catch (error: any) {
            console.error(error);
            const message = error?.response?.data?.message || "Erro ao realizar cadastro";
            alert(message);
        }
    }

    // Busca o nome do local baseado nas coordenadas (Reverse Geocoding)
    const obterEnderecoPorCoordenadas = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                { headers: { "User-Agent": "GuiaOrlaPE" } }
            );
            if (response.ok) {
                const dados = await response.json();
                return dados.display_name || `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
        } catch (err) {
            console.error(err);
        }
        return `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    // Captura o GPS do navegador e atualiza o formulário
    const usarLocalizacaoAtual = () => {
        if (!navigator.geolocation) {
            alert("Geolocalização não é suportada pelo seu navegador.");
            return;
        }

        setCarregandoGps(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const enderecoReal = await obterEnderecoPorCoordenadas(lat, lng);

                setFormData((prev) => ({
                    ...prev,
                    address: enderecoReal,
                    latitude: lat,
                    longitude: lng
                }));
                setCarregandoGps(false);
            },
            () => {
                alert("Não foi possível obter a localização atual via GPS.");
                setCarregandoGps(false);
            }
        );
    };

    // Atualiza as coordenadas quando o usuário clica diretamente no mapa do Leaflet
    const handleMapClick = async (lat: number, lng: number) => {
        setCarregandoGps(true);
        const enderecoReal = await obterEnderecoPorCoordenadas(lat, lng);
        setFormData((prev) => ({
            ...prev,
            address: enderecoReal,
            latitude: lat,
            longitude: lng
        }));
        setCarregandoGps(false);
    };

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <LayoutAuth>
            <BotaoVoltar onClick={() => step > 1 ? prevStep() : window.history.back()} />

            <div className="absolute top-4 right-4 h-28 w-28">
                <Image src="/images/LOGOfundotransparente 3.png" alt="Logo" fill className="object-contain" />
            </div>

            <div className="text-center mt-12 mb-8">
                <h2 className="text-[32px] font-medium text-[#FF7620]">Cadastro do Empreendedor</h2>
                <p className="text-[16px] text-[#FF7620] opacity-80">Passo {step} de 3</p>
            </div>

            <div className="flex w-full max-w-[450px] flex-col">
                <div className="h-[480px] w-full flex flex-col justify-start">
                    
                    {step === 1 && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-500">
                            <InputCustomizado name="userName" value={formData.userName} onChange={handleInputChange} label="Nome Completo" />
                            <InputCustomizado name="email" value={formData.email} onChange={handleInputChange} label="E-mail (Será seu Login)" type="email" />
                            <InputCustomizado name="password" value={formData.password} onChange={handleInputChange} label="Crie uma senha" type="password" showPasswordOption />
                            <InputCustomizado name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} label="Confirme sua senha" type="password" showPasswordOption />
                            <InputCustomizado name="phone" value={formData.phone} onChange={handleInputChange} label="Whatsapp ou Telefone" placeholder="Ex: 87991234567" />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500">
                            <InputCustomizado name="businessName" value={formData.businessName} onChange={handleInputChange} label="Nome do negócio" />
                            <DropdownServicos
                                label="Qual serviço você oferece?"
                                selected={formData.serviceType}
                                onSelect={(value) => setFormData((prev) => ({ ...prev, serviceType: value }))}
                            />
                            <div className="relative">
                                <InputCustomizado name="address" value={formData.address} onChange={handleInputChange} label="Endereço ou Ponto de Referência" placeholder="Ex: Av. Beira Mar, Gaibu" />
                                {carregandoGps && <Loader2 className="absolute right-4 top-11 text-[#FF7620] animate-spin" size={18} />}
                            </div>
                            
                            <button 
                                type="button"
                                onClick={usarLocalizacaoAtual}
                                className="text-left ml-4 mt-[-10px] text-[13px] font-semibold text-[#FF904B] hover:underline flex items-center gap-1"
                            >
                                Usar minha localização atual
                            </button>

                            {/* CONTAINER DO MAPA REAL (LEAFLET) */}
                            <div className="relative mt-2 w-full h-[180px] rounded-2xl bg-gray-100 overflow-hidden border border-gray-300 shadow-inner z-10">
                                <MapaCaptura 
                                    lat={formData.latitude} 
                                    lng={formData.longitude} 
                                    onChangeCoords={handleMapClick} 
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-right duration-500 w-full">
                            <h3 className="text-[22px] font-medium text-[#0A4F6E] leading-tight text-center">Adicione uma foto do seu negócio</h3>
                            
                            <div className="relative w-full h-[200px] rounded-2xl bg-white border-2 border-dashed border-[#1398D4] flex flex-col items-center justify-center gap-3 cursor-pointer">
                                <Image src="/icons/CamUpload.svg" alt="Upload" width={60} height={60} />
                                <p className="text-[#1398D4] font-semibold text-[14px] underline">Faça Upload da imagem aqui</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="h-6 w-6 rounded border-2 border-[#0A4F6E] checked:bg-[#0A4F6E]" />
                                    <span className="text-[#0A4F6E] text-[15px] font-medium">Li e aceito os Termos de Uso</span>
                                </label>
                                <Link href="/termos" className="text-[#1398D4] font-bold text-[15px] underline">Termos de Uso</Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-4">
                    <BotaoFormulario
                        variante="laranja"
                        texto={isPending ? "CARREGANDO..." : step === 3 ? "FINALIZAR CADASTRO" : "PRÓXIMO"}
                        onClick={step === 3 ? handleRegister : nextStep}
                    />
                </div>
            </div>
        </LayoutAuth>
    );
}