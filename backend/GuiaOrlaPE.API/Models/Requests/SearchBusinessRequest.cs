namespace GuiaOrlaPE.API.Models.Requests;

public class SearchBusinessRequest
{
    public string? Search { get; set; }

    // Filtro de Categoria vindo do HeaderListagem
    public string? Categoria { get; set; }

    // Filtros vindos da FiltrosInterface
    public string? Localizacao { get; set; }
    public string? FaixaPreco { get; set; }
    public bool? Cartao { get; set; }
    public bool? Chuveiro { get; set; }
    public bool? Estacionamento { get; set; }
    public bool? Cadeira { get; set; }
    public bool? PetFriendly { get; set; }
    public bool? Acessibilidade { get; set; }
    public bool? MelhoresAvaliados { get; set; }

    // Paginação padrão
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}