import { Suspense } from "react";
import { ExplorerScreen } from "@/components/ListagemServicos/ExplorerScreen";

export default function ExplorarEmpreendedorPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ExplorerScreen isEmpreendedor={true} />
        </Suspense>
    );
}