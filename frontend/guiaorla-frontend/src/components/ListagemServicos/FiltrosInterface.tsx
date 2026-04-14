// src/components/ListagemServicos/FiltrosInterface.tsx
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
        <div className="flex flex-col gap-3">
            <div>
                <h4 className="text-[#0A4F6E] font-bold text-sm mb-4 uppercase tracking-wide">💰 Preços</h4>
                <div className="flex flex-col gap-3 mb-6">
                    {[
                        { id: 'ate50', label: 'Até R$ 50' },
                        { id: '50a300', label: 'R$ 50 a R$ 300' },
                        { id: 'mais300', label: 'Mais de R$ 300' }
                    ].map((opcao) => (
                        <label key={opcao.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                key={`${contexto}-${opcao.id}-${filtros.faixaPreco}`}
                                type="radio" 
                                name={`faixaPreco-${contexto}`} // Nome único por contexto (modal ou aside)
                                value={opcao.id}
                                checked={filtros.faixaPreco === opcao.id}
                                onClick={() => handleRadioChange(opcao.id)}
                                readOnly
                                className="w-4 h-4 border-gray-300 text-[#FF7620] focus:ring-[#FF7620] cursor-pointer" 
                            />
                            <span className="text-sm text-gray-600 group-hover:text-[#0A4F6E] transition-colors">{opcao.label}</span>
                        </label>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 flex-nowrap">
                    <div className="relative flex-1 min-w-0">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold hidden sm:inline">R$</span>
                        <input 
                            type="number" placeholder="De" 
                            value={filtros.precoMinManual}
                            onChange={(e) => setFiltros((prev: any) => ({...prev, precoMinManual: e.target.value, faixaPreco: ""}))}
                            className="w-full h-10 pl-2 sm:pl-7 pr-1 rounded-lg border border-gray-200 text-xs focus:border-[#FF7620] outline-none"
                        />
                    </div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase shrink-0">até</span>
                    <div className="relative flex-1 min-w-0">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold hidden sm:inline">R$</span>
                        <input 
                            type="number" placeholder="Até" 
                            value={filtros.precoMaxManual}
                            onChange={(e) => setFiltros((prev: any) => ({...prev, precoMaxManual: e.target.value, faixaPreco: ""}))}
                            className="w-full h-10 pl-2 sm:pl-7 pr-1 rounded-lg border border-gray-200 text-xs focus:border-[#FF7620] outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => fecharModal?.()}
                        className="h-10 px-2 bg-gray-100 hover:bg-[#FF7620] hover:text-white text-gray-500 font-bold text-[10px] rounded-lg transition-all shrink-0">
                        Ir
                    </button>
                </div>
            </div>

            <div>
                <h4 className="text-[#0A4F6E] font-bold text-sm mb-4 uppercase tracking-wide">Comodidades</h4>
                <div className="flex flex-col gap-4">
                    {[
                        { id: 'cartao', label: '💳 Aceita Pix/Cartão' },
                        { id: 'petFriendly', label: '🐾 Pet Friendly' },
                        { id: 'acessibilidade', label: '♿ Acessibilidade' },
                        { id: 'melhoresAvaliados', label: '⭐ Melhores Avaliados' }
                    ].map((f) => (
                        <label key={f.id} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={filtros[f.id]}
                                onChange={() => setFiltros((prev: any) => ({ ...prev, [f.id]: !prev[f.id] }))}
                                className="w-4 h-4 rounded border-gray-300 text-[#FF7620] focus:ring-[#FF7620]" />
                            <span className="text-sm text-gray-700 group-hover:text-[#0A4F6E] transition-colors">{f.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};