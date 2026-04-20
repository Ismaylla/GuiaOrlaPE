"use client";

interface FiltrosProps {
    filtros: any;
    setFiltros: (filtros: any) => void;
    fecharModal?: () => void;
    contexto: string;
}

export const FiltrosInterface = ({ filtros, setFiltros, fecharModal, contexto }: FiltrosProps) => {

    const handleRadioChange = (id: string) => {
        setFiltros((prev: any) => ({
            ...prev,
            faixaPreco: id,
            precoMinManual: "",
            precoMaxManual: ""
        }));
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div>
                <h4 className="text-[#0A4F6E] font-bold text-[11px] mb-1 uppercase tracking-wider">💰 Preços</h4>
                <div className="flex flex-col gap-1 mb-2">
                    {[
                        { id: 'ate50', label: 'Até R$ 50' },
                        { id: '50a300', label: 'R$ 50 a R$ 300' },
                        { id: 'mais300', label: 'Mais de R$ 300' }
                    ].map((opcao) => (
                        <label key={opcao.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                key={`${contexto}-${opcao.id}-${filtros.faixaPreco}`}
                                type="radio"
                                name={`faixaPreco-${contexto}`}
                                value={opcao.id}
                                checked={filtros.faixaPreco === opcao.id}
                                onClick={() => handleRadioChange(opcao.id)}
                                readOnly
                                className="w-3.5 h-3.5 border-gray-300 text-[#FF7620] focus:ring-[#FF7620] cursor-pointer"
                            />
                            <span className="text-[12px] text-gray-600 group-hover:text-[#0A4F6E]">{opcao.label}</span>
                        </label>
                    ))}
                </div>

                <div className="flex items-center gap-1 flex-nowrap mb-3">
                    <div className="relative flex-1 min-w-0">
                        <input
                            type="number" placeholder="De R$"
                            value={filtros.precoMinManual}
                            onChange={(e) => setFiltros((prev: any) => ({ ...prev, precoMinManual: e.target.value, faixaPreco: "" }))}
                            className="w-full h-8 pl-2 pr-1 rounded-md border border-gray-200 text-[11px] focus:border-[#FF7620] outline-none"
                        />
                    </div>
                    <span className="text-gray-400 text-[10px] font-bold">a</span>
                    <div className="relative flex-1 min-w-0">
                        <input
                            type="number" placeholder="Até R$"
                            value={filtros.precoMaxManual}
                            onChange={(e) => setFiltros((prev: any) => ({ ...prev, precoMaxManual: e.target.value, faixaPreco: "" }))}
                            className="w-full h-8 pl-2 pr-1 rounded-md border border-gray-200 text-[11px] focus:border-[#FF7620] outline-none"
                        />
                    </div>
                    <button
                        onClick={() => fecharModal?.()}
                        className="h-8 px-2 bg-gray-100 hover:bg-[#FF7620] hover:text-white text-gray-500 font-bold text-[10px] rounded-md transition-all">
                        Ir
                    </button>
                </div>
            </div>

            <div className="mt-1">
                <h4 className="text-[#0A4F6E] font-bold text-[11px] mb-1 uppercase tracking-wider">Comodidades</h4>
                <div className="flex flex-col gap-1.5">
                    {[
                        { id: 'cartao', label: '💳 Pix/Cartão' }, // Texto abreviado
                        { id: 'chuveiro', label: '🚿 Chuveirão' },
                        { id: 'estacionamento', label: '🚗 Estacionamento' },
                        { id: 'cadeira', label: '⛱️ Cadeira' },
                        { id: 'petFriendly', label: '🐾 Pet Friendly' },
                        { id: 'acessibilidade', label: '♿ Acessibilidade' },
                        { id: 'melhoresAvaliados', label: '⭐ Melhores' }
                    ].map((f) => (
                        <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={filtros[f.id]}
                                onChange={() => setFiltros((prev: any) => ({ ...prev, [f.id]: !prev[f.id] }))}
                                className="w-3.5 h-3.5 rounded border-gray-300 text-[#FF7620] focus:ring-[#FF7620]" />
                            <span className="text-[12px] text-gray-700 group-hover:text-[#0A4F6E]">{f.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};