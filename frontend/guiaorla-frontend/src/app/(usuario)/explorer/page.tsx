import { Suspense } from "react";
import { ExplorerScreen } from "@/components/ListagemServicos/ExplorerScreen";

export default function ExplorarServicosPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ExplorerScreen isEmpreendedor={false} />
        </Suspense>
    );
}