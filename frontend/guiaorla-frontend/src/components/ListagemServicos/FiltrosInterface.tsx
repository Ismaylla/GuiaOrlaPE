"use client";

import { 
    CreditCard, 
    Droplets, 
    Car, 
    Umbrella, 
    Dog, 
    Accessibility, 
    Star,
    DollarSign,
    MapPin
} from "lucide-react";

interface FiltrosProps {
    filtros: any;
    setFiltros: (filtros: any) => void;
    fecharModal?: () => void;
    contexto: string;
}

export const FiltrosInterface = ({ filtros, setFiltros, fecharModal, contexto }: FiltrosProps) => {

    const regioesOrla = [
        "Todas as orlas",
        "Boa Viagem", "Pina", "Piedade", "Candeias", "Paiva",
        "Itapuama", "Gaibu", "Calhetas", "Enseada dos Corais",
        "Porto de Galinhas", "Tamandaré"
    ];

    const handleRadioChange = (id: string) => {
        setFiltros((prev: any) => ({
            ...prev,
            faixaPreco: id,
            precoMinManual: "",
            precoMaxManual: ""
        }));
    };

    return (
        <div className="flex flex-col gap-2.5"> {/* Gap reduzido */}
            {/* SEÇÃO: LOCALIZAÇÃO */}
            <div>
                <h4 className="text-[#0A4F6E] font-bold text-[10px] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={12} strokeWidth={3} className="text-[#1398D4]" />
                    Região / Orla
                </h4>
                <select 
                    value={filtros.localizacao}
                    onChange={(e) => setFiltros((p: any) => ({...p, localizacao: e.target.value}))}
                    className="w-full h-8 px-2 rounded-lg border border-gray-200 text-[11px] text-gray-700 outline-none bg-gray-50 cursor-pointer"
                >
                    {regioesOrla.map((regiao) => (
                        <option key={regiao} value={regiao === "Todas as orlas" ? "" : regiao}>
                            {regiao}
                        </option>
                    ))}
                </select>
            </div>

            {/* SEÇÃO: PREÇOS */}
            <div>
                <h4 className="text-[#0A4F6E] font-bold text-[10px] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={12} strokeWidth={3} />
                    Preços
                </h4>
                
                <div className="flex flex-col gap-0.5 mb-2"> {/* Gap mínimo aqui */}
                    {[
                        { id: 'ate50', label: 'Até R$ 50' },
                        { id: '50a300', label: 'R$ 50 a R$ 300' },
                        { id: 'mais300', label: 'Mais de R$ 300' }
                    ].map((opcao) => (
                        <label key={opcao.id} className="flex items-center gap-2 cursor-pointer group py-0.5">
                            <input
                                type="radio"
                                name={`faixaPreco-${contexto}`}
                                value={opcao.id}
                                checked={filtros.faixaPreco === opcao.id}
                                onClick={() => handleRadioChange(opcao.id)}
                                readOnly
                                className="w-3 h-3 border-gray-300 text-[#FF7620] focus:ring-[#FF7620]"
                            />
                            <span className="text-[11px] text-gray-600 group-hover:text-[#0A4F6E]">{opcao.label}</span>
                        </label>
                    ))}
                </div>

                <div className="flex items-center gap-1 mb-1">
                    <input
                        type="number" placeholder="Min"
                        value={filtros.precoMinManual}
                        onChange={(e) => setFiltros((prev: any) => ({ ...prev, precoMinManual: e.target.value, faixaPreco: "" }))}
                        className="w-full h-7 pl-2 rounded-md border border-gray-200 text-[10px] outline-none"
                    />
                    <span className="text-gray-400 text-[9px] font-bold">a</span>
                    <input
                        type="number" placeholder="Max"
                        value={filtros.precoMaxManual}
                        onChange={(e) => setFiltros((prev: any) => ({ ...prev, precoMaxManual: e.target.value, faixaPreco: "" }))}
                        className="w-full h-7 pl-2 rounded-md border border-gray-200 text-[10px] outline-none"
                    />
                    <button onClick={() => fecharModal?.()} className="h-7 px-2 bg-gray-100 hover:bg-[#FF7620] hover:text-white text-gray-500 font-bold text-[9px] rounded-md transition-all">
                        Ir
                    </button>
                </div>
            </div>

            {/* SEÇÃO: COMODIDADES */}
            <div>
                <h4 className="text-[#0A4F6E] font-bold text-[10px] mb-1.5 uppercase tracking-wider">
                    Comodidades
                </h4>
                
                <div className="flex flex-col gap-1"> {/* Gap ultra reduzido */}
                    {[
                        { id: 'cartao', label: 'Pix/Cartão', icon: <CreditCard size={12} /> },
                        { id: 'chuveiro', label: 'Chuveirão', icon: <Droplets size={12} /> },
                        { id: 'estacionamento', label: 'Estacionamento', icon: <Car size={12} /> },
                        { id: 'cadeira', label: 'Cadeira/Sol', icon: <Umbrella size={12} /> },
                        { id: 'petFriendly', label: 'Pet Friendly', icon: <Dog size={12} /> },
                        { id: 'acessibilidade', label: 'Acessibilidade', icon: <Accessibility size={12} /> },
                        { id: 'melhoresAvaliados', label: 'Melhores', icon: <Star size={12} /> }
                    ].map((f) => (
                        <label key={f.id} className="flex items-center gap-2 cursor-pointer group py-0.5">
                            <input 
                                type="checkbox" 
                                checked={filtros[f.id]}
                                onChange={() => setFiltros((prev: any) => ({ ...prev, [f.id]: !prev[f.id] }))}
                                className="w-3 h-3 rounded border-gray-300 text-[#FF7620] focus:ring-[#FF7620]" 
                            />
                            <div className="flex items-center gap-1.5 text-gray-700 group-hover:text-[#0A4F6E]">
                                <span className="text-[#0A4F6E] opacity-70">
                                    {f.icon}
                                </span>
                                <span className="text-[11px]">{f.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};