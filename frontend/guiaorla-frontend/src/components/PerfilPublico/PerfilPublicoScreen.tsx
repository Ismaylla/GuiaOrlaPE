// "use client";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
// import { PerfilHeader } from "@/components/PerfilPublico/PerfilHeader";

// interface PerfilPublicoScreenProps {
//     isEmpreendedor: boolean;
// }

// export const PerfilPublicoScreen = ({ isEmpreendedor }: PerfilPublicoScreenProps) => {
//     const router = useRouter();
//     const [scrolled, setScrolled] = useState(false);
//     const navRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleScroll = () => setScrolled(window.scrollY > 20);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     const handleCategoryClick = (cat: string) => {
//         const baseRoute = isEmpreendedor ? "/empreendedor/explorer" : "/explorer";
//         router.push(`${baseRoute}?categoria=${encodeURIComponent(cat)}`);
//     };

//     const handleMouseDown = (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => {
//         if (!ref.current || ref.current.scrollWidth <= ref.current.clientWidth) return;
//         const ele = ref.current;
//         const startX = e.pageX - ele.offsetLeft;
//         const scrollLeft = ele.scrollLeft;
//         const handleMouseMove = (le: MouseEvent) => {
//             const x = le.pageX - ele.offsetLeft;
//             const walk = (x - startX) * 2;
//             ele.scrollLeft = scrollLeft - walk;
//         };
//         const handleMouseUp = () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);
//         };
//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//     };

//     return (
//         <main className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
//             <HeaderListagem 
//                 isEmpreendedor={isEmpreendedor} 
//                 forceBlue={true}
//                 scrolled={scrolled}
//                 categoriaAtiva=""
//                 setCategoriaAtiva={handleCategoryClick}
//                 showFilter={false}
//                 setIsFilterOpen={() => {}} 
//                 navRef={navRef}
//                 handleMouseDown={handleMouseDown} 
//             />

//             <div className="h-16"></div>

//             <div className="max-w-[1100px] mx-auto">
//                 {/* Mantemos o PerfilHeader aqui dentro */}
//                 <PerfilHeader />

//                 <div className="px-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 mt-4">
//                     <aside className="flex flex-col gap-4">
//                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                              <h3 className="font-bold text-[#0A4F6E] text-lg mb-2">Sobre</h3>
//                              <p className="text-gray-600 text-sm leading-relaxed font-medium">
//                                 Os melhores cocos e frutas selecionadas da Praia de Gaibu. 
//                                 Atendimento diferenciado e qualidade garantida.
//                              </p>
//                         </div>
//                     </aside>

//                     <section className="flex flex-col gap-4">
//                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
//                             <h3 className="font-bold text-[#0A4F6E] text-xl italic mb-6">Galeria de Fotos</h3>
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                                 <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
//                                 <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
//                                 <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
//                             </div>
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         </main>
//     );
// };

"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderListagem } from "@/components/ListagemServicos/HeaderListagem";
import { PerfilHeader } from "@/components/PerfilPublico/PerfilHeader";

interface PerfilPublicoScreenProps {
    isEmpreendedor: boolean;
}

export const PerfilPublicoScreen = ({ isEmpreendedor }: PerfilPublicoScreenProps) => {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCategoryClick = (cat: string) => {
        const baseRoute = isEmpreendedor ? "/empreendedor/explorer" : "/explorer";
        router.push(`${baseRoute}?categoria=${encodeURIComponent(cat)}`);
    };

    const handleMouseDown = (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => {
        if (!ref.current || ref.current.scrollWidth <= ref.current.clientWidth) return;
        const ele = ref.current;
        const startX = e.pageX - ele.offsetLeft;
        const scrollLeft = ele.scrollLeft;
        const handleMouseMove = (le: MouseEvent) => {
            const x = le.pageX - ele.offsetLeft;
            const walk = (x - startX) * 2;
            ele.scrollLeft = scrollLeft - walk;
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <main className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
            <HeaderListagem 
                isEmpreendedor={isEmpreendedor} 
                forceBlue={true}
                scrolled={scrolled}
                categoriaAtiva=""
                setCategoriaAtiva={handleCategoryClick}
                showFilter={false}
                setIsFilterOpen={() => {}} 
                navRef={navRef}
                handleMouseDown={handleMouseDown} 
            />

            <div className="h-16"></div>

            <div className="max-w-[1100px] mx-auto">
                {/* Aqui forçamos podeEditar={false} pois esta é a visão pública */}
                <PerfilHeader podeEditar={false} />

                <div className="px-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 mt-4">
                    <aside className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                             <h3 className="font-bold text-[#0A4F6E] text-lg mb-2">Sobre</h3>
                             <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                Os melhores cocos e frutas selecionadas da Praia de Gaibu. 
                                Atendimento diferenciado e qualidade garantida.
                             </p>
                        </div>
                    </aside>

                    <section className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                            <h3 className="font-bold text-[#0A4F6E] text-xl italic mb-6">Galeria de Fotos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
                                <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
                                <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-300"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};