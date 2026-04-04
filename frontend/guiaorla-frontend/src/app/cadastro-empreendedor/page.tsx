
// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import { Eye, EyeOff, ChevronDown } from "lucide-react";

// export default function CadastroEmpreendedor() {
//     const [step, setStep] = useState(1);

//     // Estados do Dropdown Customizado (Passo 2)
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedService, setSelectedService] = useState("Selecione...");

//     // Estados para visibilidade das senhas
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     // Navegação entre passos
//     const nextStep = () => setStep((prev) => prev + 1);
//     const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

//     return (
//         <main className="flex min-h-screen w-full bg-[#ECF9FF] overflow-hidden font-sans">

//             {/* LADO ESQUERDO: Imagem com a Curva */}
//             <div className="relative hidden lg:block w-[40%] h-screen overflow-hidden rounded-br-[500px] z-20"
//                 style={{ filter: 'drop-shadow(4px 4px 100px rgba(117, 179, 198, 1))' }}>
//                 <Image
//                     src="/images/fundopraia.jpg"
//                     alt="Praia de Pernambuco"
//                     fill
//                     className="object-cover object-top"
//                     priority
//                 />
//             </div>

//             {/* LADO DIREITO: Conteúdo */}
//             <div className="relative flex w-full flex-col items-center lg:w-[60%] px-8 pt-4 pb-10 overflow-y-auto">

//                 {/* BOTÃO VOLTAR */}
//                 <button
//                     onClick={() => step > 1 ? prevStep() : window.history.back()}
//                     className="absolute top-8 left-[30px] transition-all hover:scale-110 active:scale-95 z-50"
//                 >
//                     <Image
//                         src="/icons/SetaBack.svg"
//                         alt="Voltar"
//                         width={60}
//                         height={60}
//                         priority
//                     />
//                 </button>

//                 {/* LOGO */}
//                 <div className="absolute top-4 right-4 h-28 w-28 transition-all">
//                     <Image src="/images/LOGOfundotransparente 3.png" alt="Logo" fill className="object-contain" />
//                 </div>

//                 {/* Título e Passo */}
//                 <div className="text-center mt-12 mb-8">
//                     <h2 className="text-[32px] font-medium text-[#0A4F6E]">Cadastro do Empreendedor</h2>
//                     <p className="text-[16px] text-[#0A4F6E] opacity-80">Passo {step} de 4</p>
//                 </div>

//                 {/* Formulário */}
//                 <div className="flex w-full max-w-[450px] flex-col gap-4">

//                     {/* PASSO 1: DADOS BÁSICOS */}
//                     {step === 1 && (
//                         <div className="flex flex-col gap-4 animate-in fade-in duration-500">
//                             <div className="flex flex-col gap-1">
//                                 <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Nome Completo ou do Negócio</label>
//                                 <input className="h-11 w-full rounded-full bg-white px-6 focus:outline-none" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
//                             </div>

//                             <div className="flex flex-col gap-1">
//                                 <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">E-mail (Será seu Login)</label>
//                                 <input className="h-11 w-full rounded-full bg-white px-6 focus:outline-none" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
//                             </div>

//                             <div className="flex flex-col gap-1">
//                                 <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Crie uma senha</label>
//                                 <div className="relative w-full">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         className="h-11 w-full rounded-full bg-white px-6 focus:outline-none text-[16px]"
//                                         style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
//                                     />
//                                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B]">
//                                         {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col gap-1">
//                                 <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Confirme sua senha</label>
//                                 <div className="relative w-full">
//                                     <input
//                                         type={showConfirmPassword ? "text" : "password"}
//                                         className="h-11 w-full rounded-full bg-white px-6 focus:outline-none text-[16px]"
//                                         style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
//                                     />
//                                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B]">
//                                         {showConfirmPassword ? <Eye size={22} /> : <EyeOff size={22} />}
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col gap-1">
//                                 <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Whatsapp ou Telefone</label>
//                                 <input placeholder="Ex: 87991234567" className="h-11 w-full rounded-full bg-white px-6 focus:outline-none placeholder:text-gray-400" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
//                             </div>

//                             <div className="flex justify-center mt-8 pb-10">
//                                 <button onClick={nextStep} className="h-12 w-64 rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' }}>
//                                     PRÓXIMO
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* PASSO 2: SERVIÇO E LOCALIZAÇÃO */}
//                     {step === 2 && (
//                         <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500">

//                             {/* 1. SELEÇÃO DE SERVIÇO (Dropdown Customizado com Animação) */}
//                             <div className="flex flex-col gap-1 relative z-50">
//                                 <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Qual serviço você oferece?</label>

//                                 <button
//                                     onClick={() => setIsOpen(!isOpen)}
//                                     className="h-11 w-full rounded-full bg-white px-6 shadow-md flex items-center justify-between text-[#0A4F6E] focus:outline-none"
//                                     style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
//                                 >
//                                     <span className={`${selectedService === "Selecione..." ? "text-gray-400" : "text-[#0A4F6E]"} font-normal`}>
//                                         {selectedService}
//                                     </span>
//                                     <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} />
//                                 </button>

//                                 {/* Lista com Transição Suave */}
//                                 <div className={`
//         absolute top-[85px] w-full bg-white rounded-[25px] shadow-xl border border-gray-100 overflow-hidden z-50
//         transition-all duration-300 ease-in-out origin-top
//         ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}
//       `}>
//                                     {[
//                                         "Barracas e Ambulantes",
//                                         "Passeios e Lazer",
//                                         "Bares e Restaurantes",
//                                         "Artesanato Local",
//                                         "Comércio e Serviços"
//                                     ].map((opcao) => (
//                                         <button
//                                             key={opcao}
//                                             onClick={() => {
//                                                 setSelectedService(opcao);
//                                                 setIsOpen(false);
//                                             }}
//                                             className="w-full text-left px-6 py-3 text-[#0A4F6E] font-normal hover:bg-[#DDF4FF] transition-colors border-b border-gray-100 last:border-none"
//                                         >
//                                             {opcao}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* 2. Endereço */}
//                             <div className="flex flex-col gap-1">
//                                 <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Endereço ou Ponto de Referência</label>
//                                 <input
//                                     placeholder="Ex: Av. Beira Mar, 120, Gaibu"
//                                     className="h-11 w-full rounded-full bg-white px-6 shadow-md focus:outline-none placeholder:text-gray-300 text-[#0A4F6E] font-normal"
//                                     style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
//                                 />
//                                 <button className="text-left ml-4 mt-1 text-[13px] font-semibold text-[#FF904B] hover:underline">
//                                     Usar minha localização atual
//                                 </button>
//                             </div>

//                             {/* 3. MOCKUP DO MAPA */}
//                             <div className="relative mt-2 w-full h-[180px] rounded-2xl bg-gray-200 overflow-hidden shadow-inner flex items-center justify-center border border-gray-300">
//                                 <div className="absolute inset-0 opacity-30">
//                                     <Image src="/images/mapa-mockup.png" alt="Mapa" fill className="object-cover grayscale" />
//                                 </div>
//                                 <div className="relative z-10 flex flex-col items-center">
//                                     <div className="bg-[#FF904B] text-white text-[10px] px-2 py-1 rounded-md mb-1 shadow-md font-bold italic">É aqui?</div>
//                                     <div className="h-6 w-6 bg-[#FF904B] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
//                                         <div className="h-2 w-2 bg-white rounded-full"></div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <p className="text-[10px] text-center text-gray-500 italic px-4 leading-tight mt-1">
//                                 Arraste o mapa para ajustar a posição exata, se necessário, se estiver tudo certo, clique no botão abaixo
//                             </p>

//                             {/* 4. Botão Confirmar Localização */}
//                             <div className="flex justify-center mt-4 pb-10">
//                                 <button
//                                     onClick={nextStep}
//                                     className="h-12 w-full max-w-[320px] rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
//                                     style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' }}
//                                 >
//                                     CONFIRMAR LOCALIZAÇÃO
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* PASSOS 3 E 4 */}
//                     {step > 2 && (
//                         <div className="flex flex-col items-center gap-4 mt-10 text-[#0A4F6E]">
//                             <p className="font-medium italic">Conteúdo do Passo {step} em breve...</p>
//                             <button onClick={prevStep} className="text-sm underline">Voltar</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </main>
//     );
// }
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

export default function CadastroEmpreendedor() {
    const [step, setStep] = useState(1);

    // Estados do Dropdown Customizado (Passo 2)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState("Selecione...");

    // Estados para visibilidade das senhas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Navegação entre passos
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <main className="flex min-h-screen w-full bg-[#ECF9FF] overflow-hidden font-sans">

            {/* LADO ESQUERDO: Imagem com a Curva */}
            <div className="relative hidden lg:block w-[40%] h-screen overflow-hidden rounded-br-[500px] z-20"
                style={{ filter: 'drop-shadow(4px 4px 100px rgba(117, 179, 198, 1))' }}>
                <Image
                    src="/images/fundopraia.jpg"
                    alt="Praia de Pernambuco"
                    fill
                    className="object-cover object-top"
                    priority
                />
            </div>

            {/* LADO DIREITO: Conteúdo */}
            <div className="relative flex w-full flex-col items-center lg:w-[60%] px-8 pt-4 pb-10 overflow-y-auto">

                {/* BOTÃO VOLTAR */}
                <button
                    onClick={() => step > 1 ? prevStep() : window.history.back()}
                    className="absolute top-8 left-[30px] transition-all hover:scale-110 active:scale-95 z-50"
                >
                    <Image
                        src="/icons/SetaBack.svg"
                        alt="Voltar"
                        width={60}
                        height={60}
                        priority
                    />
                </button>

                {/* LOGO */}
                <div className="absolute top-4 right-4 h-28 w-28 transition-all">
                    <Image src="/images/LOGOfundotransparente 3.png" alt="Logo" fill className="object-contain" />
                </div>

                {/* Título e Passo (Ajustado para total de 3) */}
                <div className="text-center mt-12 mb-8">
                    <h2 className="text-[32px] font-medium text-[#0A4F6E]">Cadastro do Empreendedor</h2>
                    <p className="text-[16px] text-[#0A4F6E] opacity-80">Passo {step} de 3</p>
                </div>

                {/* Formulário */}
                <div className="flex w-full max-w-[450px] flex-col gap-4">

                    {/* PASSO 1: DADOS BÁSICOS */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-500">
                            <div className="flex flex-col gap-1">
                                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Nome Completo ou do Negócio</label>
                                <input className="h-11 w-full rounded-full bg-white px-6 focus:outline-none" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">E-mail (Será seu Login)</label>
                                <input className="h-11 w-full rounded-full bg-white px-6 focus:outline-none" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
                            </div>

                            <div className="flex flex-col gap-1 relative">
                                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Crie uma senha</label>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="h-11 w-full rounded-full bg-white px-6 focus:outline-none text-[16px]"
                                        style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B]">
                                        {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 relative">
                                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Confirme sua senha</label>
                                <div className="relative w-full">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="h-11 w-full rounded-full bg-white px-6 focus:outline-none text-[16px]"
                                        style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B]">
                                        {showConfirmPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Whatsapp ou Telefone</label>
                                <input placeholder="Ex: 87991234567" className="h-11 w-full rounded-full bg-white px-6 focus:outline-none placeholder:text-gray-400" style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }} />
                            </div>

                            <div className="flex justify-center mt-8 pb-10">
                                <button onClick={nextStep} className="h-12 w-64 rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' }}>
                                    PRÓXIMO
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PASSO 2: SERVIÇO E LOCALIZAÇÃO */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500">
                            <div className="flex flex-col gap-1 relative z-50">
                                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Qual serviço você oferece?</label>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="h-11 w-full rounded-full bg-white px-6 shadow-md flex items-center justify-between text-[#0A4F6E] focus:outline-none"
                                    style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
                                >
                                    <span className={`${selectedService === "Selecione..." ? "text-gray-400" : "text-[#0A4F6E]"} font-normal`}>
                                        {selectedService}
                                    </span>
                                    <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} />
                                </button>

                                <div className={`
                                    absolute top-[85px] w-full bg-white rounded-[25px] shadow-xl border border-gray-100 overflow-hidden z-50
                                    transition-all duration-300 ease-in-out origin-top
                                    ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}
                                `}>
                                    {[
                                        "Barracas e Ambulantes", "Passeios e Lazer", "Bares e Restaurantes", "Artesanato Local", "Comércio e Serviços"
                                    ].map((opcao) => (
                                        <button
                                            key={opcao}
                                            onClick={() => { setSelectedService(opcao); setIsOpen(false); }}
                                            className="w-full text-left px-6 py-3 text-[#0A4F6E] font-normal hover:bg-[#DDF4FF] transition-colors border-b border-gray-100 last:border-none"
                                        >
                                            {opcao}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">Endereço ou Ponto de Referência</label>
                                <input
                                    placeholder="Ex: Av. Beira Mar, 120, Gaibu"
                                    className="h-11 w-full rounded-full bg-white px-6 shadow-md focus:outline-none placeholder:text-gray-300 text-[#0A4F6E] font-normal"
                                    style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
                                />
                                <button className="text-left ml-4 mt-1 text-[13px] font-semibold text-[#FF904B] hover:underline">
                                    Usar minha localização atual
                                </button>
                            </div>

                            <div className="relative mt-2 w-full h-[180px] rounded-2xl bg-gray-200 overflow-hidden shadow-inner flex items-center justify-center border border-gray-300">
                                <div className="absolute inset-0 opacity-30">
                                    <Image src="/images/mapa-mockup.png" alt="Mapa" fill className="object-cover grayscale" />
                                </div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="bg-[#FF904B] text-white text-[10px] px-2 py-1 rounded-md mb-1 shadow-md font-bold italic">É aqui?</div>
                                    <div className="h-6 w-6 bg-[#FF904B] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                        <div className="h-2 w-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-4 pb-10">
                                <button onClick={nextStep} className="h-12 w-full max-w-[320px] rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' }}>
                                    CONFIRMAR LOCALIZAÇÃO
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PASSO 3: FOTO E TERMOS (Antigo Passo 4) */}
                    {step === 3 && (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-right duration-500 w-full">
                            <div className="text-center">
                                <h3 className="text-[22px] font-medium text-[#0A4F6E] leading-tight">Adicione uma foto do seu negócio</h3>
                                <p className="text-[14px] text-[#0A4F6E] opacity-70">Isso ajuda os turistas a te encontrarem mais rápido!</p>
                            </div>

                            <div className="relative w-full max-w-[400px] h-[220px] rounded-2xl bg-white border-2 border-dashed border-[#1398D4] shadow-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 transition-colors">
                                <div className="relative h-16 w-16">
                                    <Image src="/icons/CamUpload.svg" alt="Upload" fill className="object-contain" />
                                </div>
                                <p className="text-[#FF904B] font-semibold text-[14px] underline underline-offset-4">Faça Upload da imagem aqui</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>

                            <div className="flex flex-col items-center gap-4 mt-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="checkbox" className="peer appearance-none h-6 w-6 rounded border-2 border-[#0A4F6E] checked:bg-[#0A4F6E] transition-all cursor-pointer" />
                                        <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-[#0A4F6E] text-[15px] font-medium">Li e aceito os Termos de Uso</span>
                                </label>
                                <Link href="/termos" className="text-[#FF904B] font-bold text-[15px] underline underline-offset-4 hover:scale-105 transition-transform">
                                    Termos de Uso
                                </Link>
                            </div>

                            <div className="flex justify-center mt-6 w-full pb-10">
                                <button className="h-12 w-full max-w-[320px] rounded-full font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 100%)' }}>
                                    FINALIZAR CADASTRO
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}