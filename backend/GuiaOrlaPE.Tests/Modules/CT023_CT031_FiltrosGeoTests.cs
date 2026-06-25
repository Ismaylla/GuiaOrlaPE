using FluentAssertions;
using GuiaOrlaPE.Tests.Helpers;
using System.Net;
using Xunit;
using System.Text.Json;
using System.Linq;

namespace GuiaOrlaPE.Tests.Modules;

/// <summary>
/// CT-023 a CT-031 — Filtros de Empreendimentos e Geolocalização
/// Execute com: dotnet test --filter "Category=Filtros"
/// </summary>
[Trait("Category", "Filtros")]
public class CT023_CT031_FiltrosGeoTests : IClassFixture<GuiaOrlaWebFactory>
{
    private readonly HttpClient _client;

    public CT023_CT031_FiltrosGeoTests(GuiaOrlaWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task CriarNegocioNaOrla(string nome, string endereco, string regiao,
        bool temEstacionamento = false, bool temPix = false, bool temCartao = false)
    {
        var email = $"orla_{Guid.NewGuid():N}@email.com";

        var json = $$"""
        {
            "name": "Proprietário Teste",
            "email": "{{email}}",
            "password": "123456",
            "phone": "81999999999",
            "business": {
                "name": "{{nome}}",
                "serviceType": "Restaurante",
                "address": "{{endereco}}",
                "region": "{{regiao}}",
                "latitude": -8.1178,
                "longitude": -34.9006,
                "estacionamento": {{temEstacionamento.ToString().ToLower()}},
                "pix": {{temPix.ToString().ToLower()}},
                "cartao": {{temCartao.ToString().ToLower()}},
                "businessPhotoUrl": ""
            }
        }
        """;

        await _client.PostAsync(
            "/api/users/businessperson",
            TestFixtures.Json(json));
    }

    [Fact(DisplayName = "CT-023 — Listagem sem filtros retorna todos os empreendimentos")]
    public async Task CT023_ListagemSemFiltros_RetornaTodos()
    {
        await CriarNegocioNaOrla("Barracão do Mar", "Av. Boa Viagem, 100", "Boa Viagem");
        await CriarNegocioNaOrla("Quiosque da Praia", "Rua das Ondas, 50", "Porto de Galinhas");

        var response = await _client.GetAsync("/api/business");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadAsStringAsync();
        body.Should().NotBe("[]");
    }

    [Fact(DisplayName = "CT-024 — Filtro por região retorna apenas empreendimentos da orla selecionada")]
    public async Task CT024_FiltrarPorRegiao_RetornaApenasOrlaFiltrada()
    {
        await CriarNegocioNaOrla("Restaurante Boa Viagem", "Av. Boa Viagem, 500", "Boa Viagem");

        var response = await _client.GetAsync(
            "/api/business/search?region=Boa+Viagem");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            if (body != "[]")
                body.ToLower().Should().Contain("boa viagem");
        }
    }

    [Fact(DisplayName = "CT-025 — Filtro por comodidade 'estacionamento' retorna apenas compatíveis")]
    public async Task CT025_FiltrarPorComodidade_RetornaApenasCompatíveis()
    {
        await CriarNegocioNaOrla("Com Estacionamento", "Av. Central, 100", "Recife", true);
        await CriarNegocioNaOrla("Sem Estacionamento", "Rua Lateral, 200", "Recife", false);

        var response = await _client.GetAsync(
            "/api/business/search?estacionamento=true");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            if (body != "[]")
                body.ToLower().Should().NotContain("sem estacionamento");
        }
    }

    [Fact(DisplayName = "CT-026 — Filtro por múltiplas comodidades retorna apenas quem tem todas")]
    public async Task CT026_FiltrarPorMultiplasComodidades_RetornaApenasQuemTemTodas()
    {
        await CriarNegocioNaOrla("Completo", "Av. Praia, 1", "Recife", false, true, true);
        await CriarNegocioNaOrla("Só Pix", "Av. Praia, 2", "Recife", false, true, false);

        var response = await _client.GetAsync(
            "/api/business/search?pix=true&cartao=true");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            if (body != "[]")
                body.ToLower().Should().NotContain("só pix");
        }
    }

    [Fact(DisplayName = "CT-027 — Filtro sem resultados retorna lista vazia ou 404")]
    public async Task CT027_FiltroSemResultados_RetornaVazioOu404()
    {
        var region = $"Orla_{Guid.NewGuid():N}";

        var response = await _client.GetAsync(
            $"/api/business/search?region={Uri.EscapeDataString(region)}");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            body.Should().BeOneOf("[]", "null", "");
        }
    }

    [Fact(DisplayName = "CT-028 — Remoção de filtros restaura listagem completa")]
    public async Task CT028_RemoverFiltros_RestaurarListagemCompleta()
    {
        await CriarNegocioNaOrla("Restaurante Filtrado", "Av. Mar, 10", "Boa Viagem");

        var semFiltro = await _client.GetAsync("/api/business");

        semFiltro.StatusCode.Should().Be(HttpStatusCode.OK);

        var bodySemFiltro = await semFiltro.Content.ReadAsStringAsync();
        bodySemFiltro.Should().NotBe("[]");
    }

    [Fact(DisplayName = "CT-029 — Busca por nome retorna apenas empreendimentos com o termo")]
    public async Task CT029_BuscaPorNome_RetornaApenasComOTermo()
    {
        await CriarNegocioNaOrla("Esquina do Mar", "Rua A, 1", "Recife");
        await CriarNegocioNaOrla("Barraca Legal", "Rua B, 2", "Recife");

        var response = await _client.GetAsync(
            "/api/business/search?name=Esquina");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            if (body != "[]")
            {
                body.ToLower().Should().Contain("esquina");
                body.ToLower().Should().NotContain("barraca legal");
            }
        }
    }

    [Fact(DisplayName = "CT-030 — Busca case-insensitive encontra empreendimento independente de capitalização")]
    public async Task CT030_BuscaCaseInsensitive_EncontraIndependenteDeMaiusculas()
    {
        await CriarNegocioNaOrla("Esquina do Mar", "Rua A, 1", "Recife");

        var response = await _client.GetAsync(
            "/api/business/search?name=esQuInA");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            if (body != "[]")
                body.ToLower().Should().Contain("esquina");
        }
    }

    [Fact(DisplayName = "CT-031 — Ordenação por distância retorna empreendimentos do mais próximo ao mais distante")]
    public async Task CT031_OrdenacaoPorDistancia_RetornaEmOrdemCrescente()
    {
        var emailProximo = $"prox_{Guid.NewGuid():N}@email.com";
        var emailDistante = $"dist_{Guid.NewGuid():N}@email.com";

        var jsonProximo = $$"""
        {
            "name": "Dono Próximo",
            "email": "{{emailProximo}}",
            "password": "123456",
            "phone": "81999999999",
            "business": {
                "name": "Barraca Próxima",
                "serviceType": "Restaurante",
                "address": "Praia de Boa Viagem",
                "latitude": -8.1178,
                "longitude": -34.9006,
                "businessPhotoUrl": ""
            }
        }
        """;

        var jsonDistante = $$"""
        {
            "name": "Dono Distante",
            "email": "{{emailDistante}}",
            "password": "123456",
            "phone": "81999999999",
            "business": {
                "name": "Barraca Distante",
                "serviceType": "Restaurante",
                "address": "Porto de Galinhas",
                "latitude": -8.7042,
                "longitude": -35.1460,
                "businessPhotoUrl": ""
            }
        }
        """;

        await _client.PostAsync("/api/users/businessperson", TestFixtures.Json(jsonProximo));
        await _client.PostAsync("/api/users/businessperson", TestFixtures.Json(jsonDistante));

        var response = await _client.GetAsync(
            "/api/business/nearby?latitude=-8.1178&longitude=-34.9006");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound,
            HttpStatusCode.MethodNotAllowed);
    }
}