using FluentAssertions;
using GuiaOrlaPE.Tests.Helpers;
using System.Net;
using Xunit;
using System.Text.Json;

namespace GuiaOrlaPE.Tests.Modules;

/// <summary>
/// CT-015 a CT-022 — Módulo de Empreendimentos
/// Execute com: dotnet test --filter "Category=Empreendimentos"
/// </summary>
[Trait("Category", "Empreendimentos")]
public class CT015_CT022_EmpreendimentosTests : IClassFixture<GuiaOrlaWebFactory>
{
    private readonly HttpClient _client;

    public CT015_CT022_EmpreendimentosTests(GuiaOrlaWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<(Guid UserId, Guid BusinessId)> CriarUsuarioComNegocioAsync()
    {
        var email = $"biz_{Guid.NewGuid():N}@email.com";
        var json = TestFixtures.UsuarioValidoJson(email: email);

        var resp = await _client.PostAsync(
            "/api/users/businessperson",
            TestFixtures.Json(json));

        resp.EnsureSuccessStatusCode();

        var body = await resp.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);

        var userId = doc.RootElement.GetProperty("id").GetGuid();
        var businessId = doc.RootElement.GetProperty("businesses")[0].GetProperty("id").GetGuid();

        return (userId, businessId);
    }

    [Fact(DisplayName = "CT-015 — Cadastro de empreendimento válido retorna 201")]
    public async Task CT015_CadastroEmpreendimentoValido_Retorna201()
    {
        var (userId, _) = await CriarUsuarioComNegocioAsync();

        var businessJson = $$"""
        {
            "userId": "{{userId}}",
            "name": "Restaurante Beira Mar",
            "serviceType": "Restaurante",
            "address": "Av. Boa Viagem, 1000",
            "latitude": -8.1178,
            "longitude": -34.9006,
            "businessPhotoUrl": ""
        }
        """;

        var response = await _client.PostAsync(
            "/api/business",
            TestFixtures.Json(businessJson));

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact(DisplayName = "CT-016 — Cadastro de empreendimento com dados inválidos retorna 400")]
    public async Task CT016_CadastroEmpreendimentoDadosInvalidos_Retorna400()
    {
        var bodyInvalido = """
        {
            "userId": "00000000-0000-0000-0000-000000000000",
            "name": "",
            "serviceType": "",
            "address": "",
            "latitude": 0,
            "longitude": 0,
            "businessPhotoUrl": ""
        }
        """;

        var response = await _client.PostAsync(
            "/api/business",
            TestFixtures.Json(bodyInvalido));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.BadRequest,
            HttpStatusCode.UnprocessableEntity);
    }

    [Fact(DisplayName = "CT-017 — Listagem de empreendimentos retorna 200 com dados")]
    public async Task CT017_ListagemEmpreendimentos_Retorna200ComLista()
    {
        await CriarUsuarioComNegocioAsync();

        var response = await _client.GetAsync("/api/business");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadAsStringAsync();
        body.Should().NotBe("[]");
    }

    [Fact(DisplayName = "CT-018 — Busca de empreendimento por ID válido retorna 200")]
    public async Task CT018_BuscarEmpreendimentoPorId_Retorna200()
    {
        var (_, businessId) = await CriarUsuarioComNegocioAsync();

        var response = await _client.GetAsync($"/api/business/{businessId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact(DisplayName = "CT-019 — Busca com filtro de categoria retorna resultados compatíveis")]
    public async Task CT019_BuscaComFiltroCategoria_RetornaApenasCompativeis()
    {
        await CriarUsuarioComNegocioAsync();

        var response = await _client.GetAsync(
            "/api/business/search?serviceType=Restaurante");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NotFound);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            if (body != "[]")
                body.ToLower().Should().Contain("restaurante");
        }
    }

    [Fact(DisplayName = "CT-020 — Busca de empreendimento inexistente retorna 404")]
    public async Task CT020_BuscarEmpreendimentoInexistente_Retorna404()
    {
        var idInexistente = Guid.NewGuid();

        var response = await _client.GetAsync($"/api/business/{idInexistente}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact(DisplayName = "CT-021 — Atualização de empreendimento retorna sucesso")]
    public async Task CT021_AtualizarEmpreendimento_RetornaSucesso()
    {
        var (userId, businessId) = await CriarUsuarioComNegocioAsync();

        var updateJson = $$"""
        {
            "userId": "{{userId}}",
            "name": "Restaurante Premium",
            "serviceType": "Restaurante",
            "address": "Av. Boa Viagem, 2000",
            "latitude": -8.1178,
            "longitude": -34.9006,
            "businessPhotoUrl": ""
        }
        """;

        var response = await _client.PutAsync(
            $"/api/business/{businessId}",
            TestFixtures.Json(updateJson));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NoContent);
    }

    [Fact(DisplayName = "CT-022 — Exclusão de empreendimento retorna sucesso")]
    public async Task CT022_ExcluirEmpreendimento_RetornaSucesso()
    {
        var (_, businessId) = await CriarUsuarioComNegocioAsync();

        var response = await _client.DeleteAsync($"/api/business/{businessId}");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NoContent);
    }
}