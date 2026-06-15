"use client";
import { useState, useRef } from "react";
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
import { Loader2, MapPin } from "lucide-react";

const MapaCaptura = dynamic(
    () => import("@/components/Empreendedor/MapaCaptura").then((mod) => mod.MapaCaptura),
    { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Carregando mapa interativo...</div> }
);

export default function CadastroEmpreendedor() {
    const [step, setStep] = useState(1);
    const [carregandoGps, setCarregandoGps] = useState(false);
    const router = useRouter();

    const { mutateAsync, isPending } = useRegisterBusinessperson();

    const [formData, setFormData] = useState({
        userName: "", email: "", password: "", confirmPassword: "", phone: "",
        businessName: "", address: "",
        serviceType: BusinessServiceTypeEnum.ArtesanatoLocal,
        latitude: -8.3364, longitude: -34.9451,
    });

    const [sugestoesEndereco, setSugestoesEndereco] = useState<any[]>([]);
    const [buscandoSugestoes, setBuscandoSugestoes] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [aceitouTermos, setAceitouTermos] = useState(false);

    const nextStep = () => {
        if (step === 1) {
            if (!formData.userName.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword || !formData.phone.trim()) {
                alert("Por favor, preencha todos os campos pessoais antes de continuar.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Por favor, insira um e-mail válido.");
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                alert("As senhas não coincidem. Verifique e tente novamente.");
                return;
            }

            if (formData.password.length < 6) {
                alert("A senha deve ter pelo menos 6 caracteres.");
                return;
            }
        }

        setStep((prev) => prev + 1);
    };

    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

    async function handleRegister() {
        try {
            if (!formData.businessName.trim() || !formData.address.trim()) {
                alert("Por favor, preencha o nome e o endereço do seu negócio.");
                return;
            }

            if (!aceitouTermos) {
                alert("Você precisa aceitar os Termos de Uso para finalizar o cadastro.");
                return;
            }

            const payload: CreateBusinesspersonRequest = {
                name: formData.userName, email: formData.email, password: formData.password, phone: formData.phone,
                business: {
                    name: formData.businessName, serviceType: formData.serviceType,
                    address: formData.address,
                    latitude: formData.latitude, longitude: formData.longitude,
                    businessPhotoUrl: "",
                },
            };

            await mutateAsync(payload);
            router.push("/empreendedor/login-empreendedor");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Erro ao realizar cadastro");
        }
    }

    const obterEnderecoPorCoordenadas = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, { headers: { "User-Agent": "GuiaOrlaPE" } });
            if (response.ok) {
                const dados = await response.json();
                return dados.display_name || `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
        } catch (err) { console.error(err); }
        return `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    const usarLocalizacaoAtual = () => {
        if (!navigator.geolocation) { alert("Geolocalização não é suportada pelo seu navegador."); return; }
        setCarregandoGps(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude; const lng = pos.coords.longitude;
                const enderecoReal = await obterEnderecoPorCoordenadas(lat, lng);
                setFormData((prev) => ({ ...prev, address: enderecoReal, latitude: lat, longitude: lng }));
                setCarregandoGps(false);
            },
            () => { alert("Não foi possível obter a localização atual via GPS."); setCarregandoGps(false); }
        );
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setCarregandoGps(true);
        const enderecoReal = await obterEnderecoPorCoordenadas(lat, lng);
        setFormData((prev) => ({ ...prev, address: enderecoReal, latitude: lat, longitude: lng }));
        setCarregandoGps(false);
    };

    const handleAddressTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFormData((prev) => ({ ...prev, address: val }));
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (val.length < 4) { setSugestoesEndereco([]); setMostrarSugestoes(false); return; }

        timeoutRef.current = setTimeout(async () => {
            setBuscandoSugestoes(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&countrycodes=br`, { headers: { "User-Agent": "GuiaOrlaPE" } });
                const data = await res.json();
                setSugestoesEndereco(data); setMostrarSugestoes(true);
            } catch (err) { console.error("Erro ao buscar sugestões:", err); } finally { setBuscandoSugestoes(false); }
        }, 800);
    };

    const selecionarSugestao = (sugestao: any) => {
        setFormData((prev) => ({ ...prev, address: sugestao.display_name, latitude: parseFloat(sugestao.lat), longitude: parseFloat(sugestao.lon) }));
        setMostrarSugestoes(false);
    };

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <LayoutAuth>
            <BotaoVoltar onClick={() => step > 1 ? prevStep() : window.history.back()} />

            <div className="absolute top-4 right-4 h-28 w-28">
                <Image src="/images/LOGOfundotransparente 3.png" alt="Logo" fill className="object-contain" />
            </div>

            {/* mt-4 em vez de mt-12 para não empurrar demais */}
            <div className="text-center mt-4 mb-6">
                <h2 className="text-[32px] font-medium text-[#FF7620]">Cadastro do Empreendedor</h2>
                <p className="text-[16px] text-[#FF7620] opacity-80">Passo {step} de 2</p>
            </div>

            <div className="flex w-full max-w-[450px] flex-col flex-grow">
                <div className="w-full flex flex-col justify-start pb-6 flex-1">

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
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500 relative">
                            <InputCustomizado name="businessName" value={formData.businessName} onChange={handleInputChange} label="Nome do negócio" />

                            <div className="relative z-[60]">
                                <DropdownServicos
                                    label="Qual serviço você oferece?"
                                    selected={formData.serviceType}
                                    onSelect={(value) => setFormData((prev) => ({ ...prev, serviceType: value }))}
                                />
                            </div>

                            <div className="relative z-50">
                                <InputCustomizado name="address" value={formData.address} onChange={handleAddressTyping} label="Endereço ou Ponto de Referência" placeholder="Digite para buscar seu local..." />
                                {buscandoSugestoes && <Loader2 className="absolute right-4 top-11 text-[#FF7620] animate-spin" size={18} />}

                                {mostrarSugestoes && sugestoesEndereco.length > 0 && (
                                    <ul className="absolute top-full left-0 right-0 bg-white mt-2 rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-48 overflow-y-auto">
                                        {sugestoesEndereco.map((sugestao, idx) => (
                                            <li key={idx} onClick={() => selecionarSugestao(sugestao)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-start gap-3 border-b border-gray-100 last:border-0 transition-colors">
                                                <MapPin className="text-[#1398D4] shrink-0 mt-0.5" size={16} />
                                                <span className="text-xs text-gray-700 leading-tight">{sugestao.display_name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button type="button" onClick={usarLocalizacaoAtual} className="text-left ml-4 mt-[-10px] text-[13px] font-semibold text-[#FF904B] hover:underline flex items-center gap-1">
                                Usar minha localização atual
                            </button>

                            <div className="relative mt-2 w-full h-[180px] rounded-2xl bg-gray-100 overflow-hidden border border-gray-300 shadow-inner z-10 shrink-0">
                                <MapaCaptura lat={formData.latitude} lng={formData.longitude} onChangeCoords={handleMapClick} />
                            </div>

                            <div className="flex flex-col gap-2 mt-2 px-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={aceitouTermos} onChange={(e) => setAceitouTermos(e.target.checked)} className="h-5 w-5 rounded border-2 border-[#0A4F6E] checked:bg-[#0A4F6E]" />
                                    <span className="text-[#0A4F6E] text-[14px] font-medium">Li e aceito os Termos de Uso</span>
                                </label>
                                <Link href="/termos" className="text-[#1398D4] font-bold text-[13px] underline ml-8">Ler Termos de Uso</Link>
                            </div>
                        </div>
                    )}

                </div>

                {/* Botão fixo no final do container do formulário */}
                <div className="flex justify-center mt-2 mb-4">
                    <BotaoFormulario
                        variante="laranja"
                        texto={isPending ? "CRIANDO CONTA..." : step === 2 ? "FINALIZAR CADASTRO" : "PRÓXIMO"}
                        onClick={step === 2 ? handleRegister : nextStep}
                    />
                </div>
            </div>
        </LayoutAuth>
    );
}