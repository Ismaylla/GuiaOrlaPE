using FluentAssertions;
using GuiaOrlaPE.API.IntegrationTests.Helpers;
using System.Net;
using Xunit;

namespace GuiaOrlaPE.API.IntegrationTests.Modules;

/// <summary>
/// CT-001 a CT-004 — Módulo de Autenticação
/// Roda sem Docker: usa SQLite em memória via GuiaOrlaWebFactory.
/// Execute com: dotnet test --filter "Category=Autenticacao"
/// </summary>
[Trait("Category", "Autenticacao")]
public class CT001_CT004_AutenticacaoTests : IClassFixture<GuiaOrlaWebFactory>
{
    private readonly HttpClient _client;

    public CT001_CT004_AutenticacaoTests(GuiaOrlaWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    // -------------------------------------------------------------------------
    // CT-001 — Login de Empreendedor com Credenciais Válidas
    // Esperado: 200 OK com accessToken no corpo
    // -------------------------------------------------------------------------
    [Fact(DisplayName = "CT-001 — Login com credenciais válidas retorna 200 e token")]
    public async Task CT001_LoginCredenciaisValidas_Retorna200ComToken()
    {
        await TestFixtures.CriarUsuarioAsync(_client,
            email: "empreendedor@teste.com",
            senha: "123456");

        var loginJson = """{"email":"empreendedor@teste.com","password":"123456"}""";

        var response = await _client.PostAsync(
            "/api/users/login",
            TestFixtures.Json(loginJson));

        response.StatusCode
            .Should()
            .Be(HttpStatusCode.OK, because: "credenciais válidas devem autenticar o usuário (CT-001)");

        var body = await response.Content.ReadAsStringAsync();
        body.Should()
            .Contain("accessToken", because: "a resposta deve conter o token JWT (CT-001)");
    }

    // -------------------------------------------------------------------------
    // CT-002 — Login com Senha Inválida
    // -------------------------------------------------------------------------
    [Fact(DisplayName = "CT-002 — Login com senha inválida retorna erro de autenticação")]
    public async Task CT002_LoginSenhaInvalida_RetornaErroAutenticacao()
    {
        await TestFixtures.CriarUsuarioAsync(_client,
            email: "empreendedor2@teste.com",
            senha: "123456");

        var loginJson = """{"email":"empreendedor2@teste.com","password":"senhaErrada"}""";

        var response = await _client.PostAsync(
            "/api/users/login",
            TestFixtures.Json(loginJson));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.BadRequest,
            HttpStatusCode.Unauthorized,
            HttpStatusCode.OK
        );

        if (response.StatusCode == HttpStatusCode.OK)
        {
            false.Should().BeTrue(
                because: "CT-002 FALHOU: sistema autenticou senha inválida. " +
                         "Implementar verificação de senha no Login.");
        }
    }

    // -------------------------------------------------------------------------
    // CT-003 — Login com E-mail Não Cadastrado
    // -------------------------------------------------------------------------
    [Fact(DisplayName = "CT-003 — Login com e-mail não cadastrado retorna 400")]
    public async Task CT003_LoginEmailNaoCadastrado_Retorna400()
    {
        var loginJson = """{"email":"inexistente@teste.com","password":"123456"}""";

        var response = await _client.PostAsync(
            "/api/users/login",
            TestFixtures.Json(loginJson));

        response.StatusCode.Should().Be(
            HttpStatusCode.BadRequest,
            because: "e-mail não cadastrado deve retornar 400 (CT-003)");

        var body = await response.Content.ReadAsStringAsync();
        body.Should().Contain(
            "não encontrado",
            because: "mensagem deve indicar usuário inexistente (CT-003)");
    }

    // -------------------------------------------------------------------------
    // CT-004 — Login com Campos Vazios
    // -------------------------------------------------------------------------
    [Fact(DisplayName = "CT-004 — Login com campos vazios retorna 400")]
    public async Task CT004_LoginCamposVazios_Retorna400()
    {
        var loginJson = """{"email":"","password":""}""";

        var response = await _client.PostAsync(
            "/api/users/login",
            TestFixtures.Json(loginJson));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.BadRequest,
            HttpStatusCode.UnsupportedMediaType
            );
    }
}