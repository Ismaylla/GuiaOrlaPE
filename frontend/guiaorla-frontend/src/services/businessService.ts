import { api } from "./api";

/**
 * Traz todos os estabelecimentos da orla
 */
export async function listarTodosOsNegocios(): Promise<any[]> {
  try {
    const response = await api.get<any[]>("/api/business", {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      params: { _t: new Date().getTime() } //  MÁGICA ANTI-CACHE AQUI
    });
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
      pageSize: 10,
      _t: new Date().getTime() //  MÁGICA ANTI-CACHE AQUI TAMBÉM
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

    const response = await api.get<any>("/api/business/search", { 
      params,
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro no service ao executar SearchAsync:", error);
    throw error;
  }
}

/**
 * Busca um único estabelecimento pelo ID específico
 * @param id O UUID do negócio vindo da rota dinâmica
 */
export async function buscarNegocioPorId(id: string): Promise<any> {
  try {
    const response = await api.get<any>(`/api/business/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      params: { _t: new Date().getTime() } //  MÁGICA ANTI-CACHE AQUI
    });
    return response.data;
  } catch (error) {
    console.error(`Erro no service ao executar GetByIdAsync para o ID ${id}:`, error);
    throw error;
  }
}

/**
 * Busca todas as avaliações reais de um estabelecimento específico
 * @param businessId O UUID do quiosque
 */
export async function listarAvaliacoesDoNegocio(businessId: string): Promise<any[]> {
  try {
    const response = await api.get<any[]>(`/api/business/${businessId}/reviews`);
    return response.data;
  } catch (error: any) {
    // Se o erro for 404 (Rota não existe no C#), silencia e entrega o array vazio
    if (error.response && error.response.status === 404) {
      return [];
    }
    
    console.error("Erro inesperado ao buscar avaliações:", error);
    return []; 
  }
} 

/**
 * Cadastra um novo estabelecimento na orla
 * @param dadosObjeto Os dados vindos do formulário de cadastro
 */
export async function cadastrarNovoNegocio(dadosObjeto: any): Promise<any> {
  try {
    // Dispara um POST direto para a rota que criamos no BusinessController do C#
    const response = await api.post<any>("/api/business", dadosObjeto);
    return response.data;
  } catch (error) {
    console.error("Erro no service ao executar CreateAsync:", error);
    throw error;
  }
}

/**
 * Atualiza os dados de um negócio existente
 * @param id O UUID do negócio
 * @param dados O objeto contendo todos os dados do negócio (CreateBusinessRequest)
 * @param token O token de autenticação JWT
 */
export async function atualizarNegocio(id: string, dados: any, token: string): Promise<any> {
    try {
      const response = await api.put<any>(`/api/business/${id}`, dados, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro no service ao atualizar o negócio:", error);
      throw error;
    }
  }