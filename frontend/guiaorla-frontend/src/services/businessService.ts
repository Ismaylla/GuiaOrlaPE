import { api } from "./api";

/**
 * Traz todos os estabelecimentos da orla
 */
export async function listarTodosOsNegocios(): Promise<any[]> {
  try {
    const response = await api.get<any[]>("/api/business");
    return response.data;
  } catch (error) {
    console.error("Erro no service ao executar GetAllAsync:", error);
    throw error;
  }
}

/**
 * Busca os estabelecimentos aplicando os filtros e a categoria selecionada
 * @param filtrosObjeto O estado de filtros atual da sua ExplorerScreen
 * @param categoriaAtiva A categoria string selecionada no HeaderListagem
 * @param termoBusca O texto digitado na barra de pesquisa (Onde vamos hoje?)
 */
export async function buscarNegociosComFiltros(
  filtrosObjeto: any, 
  categoriaAtiva?: string,
  termoBusca?: string
): Promise<any> {
  try {
    const params: any = {
      page: 1,
      pageSize: 10
    };

    // 1. Mapeia a barra de pesquisa de texto
    if (termoBusca) params.search = termoBusca;

    // 2. Mapeia a categoria ativa vinda do Header
    if (categoriaAtiva) params.categoria = categoriaAtiva;

    // 3. Mapeia os filtros da FiltrosInterface
    if (filtrosObjeto.localizacao) params.localizacao = filtrosObjeto.localizacao;
    if (filtrosObjeto.faixaPreco) params.faixaPreco = filtrosObjeto.faixaPreco;
    
    // Passa os booleanos das comodidades apenas se estiverem marcados (true)
    if (filtrosObjeto.cartao) params.cartao = true;
    if (filtrosObjeto.chuveiro) params.chuveiro = true;
    if (filtrosObjeto.estacionamento) params.estacionamento = true;
    if (filtrosObjeto.cadeira) params.cadeira = true;
    if (filtrosObjeto.petFriendly) params.petFriendly = true;
    if (filtrosObjeto.acessibilidade) params.acessibilidade = true;
    if (filtrosObjeto.melhoresAvaliados) params.melhoresAvaliados = true;

    const response = await api.get<any>("/api/business/search", { params });
    return response.data;
  } catch (error) {
    console.error("Erro no service ao executar SearchAsync:", error);
    throw error;
  }
}