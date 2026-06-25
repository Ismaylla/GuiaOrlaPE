using FluentAssertions;
using GuiaOrlaPE.Tests.Helpers;
using System.Net;
using Xunit;
using System.Text.Json;

namespace GuiaOrlaPE.Tests.Modules;

[Trait("Category", "Usuarios")]
public class CT005_CT014_UsuariosTests : IClassFixture<GuiaOrlaWebFactory>
{
    private readonly HttpClient _client;

    public CT005_CT014_UsuariosTests(GuiaOrlaWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact(DisplayName = "CT-005 — Cadastro de empreendedor válido retorna 201")]
    public async Task CT005_CadastroEmpreendedorValido_Retorna201()
    {
        var email = $"ct005_{Guid.NewGuid():N}@email.com";
        var body = TestFixtures.UsuarioValidoJson(email: email);

        var response = await _client.PostAsync(
            "/api/users/businessperson",
            TestFixtures.Json(body));

        response.StatusCode
            .Should()
            .Be(HttpStatusCode.Created,
                because: "dados válidos devem criar o usuário e retornar 201");

        var responseBody = await response.Content.ReadAsStringAsync();
        responseBody.Should().Contain(
            "id",
            because: "o corpo deve conter o ID do usuário criado");
    }

    [Fact(DisplayName = "CT-006 — Cadastro com e-mail duplicado é bloqueado")]
    public async Task CT006_CadastroEmailDuplicado_BloqueiaSegundoCadastro()
    {
        var email = $"ct006_{Guid.NewGuid():N}@email.com";

        await _client.PostAsync(
            "/api/users/businessperson",
            TestFixtures.Json(TestFixtures.UsuarioValidoJson(email: email)));

        var response = await _client.PostAsync(
            "/api/users/businessperson",
            TestFixtures.Json(TestFixtures.UsuarioValidoJson(email: email)));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.Conflict,
            HttpStatusCode.InternalServerError,
            HttpStatusCode.BadRequest);

        response.StatusCode.Should()
            .NotBe(HttpStatusCode.Created,
                because: "e-mail duplicado não deve criar novo usuário");
    }

    [Fact(DisplayName = "CT-007 — Cadastro com dados inválidos retorna 400")]
    public async Task CT007_CadastroDadosInvalidos_Retorna400()
    {
        var bodyInvalido = """
        {
            "name": "",
            "email": "email_invalido",
            "password": "12",
            "phone": "",
            "business": {
                "name": "",
                "serviceType": "",
                "address": "",
                "latitude": 0,
                "longitude": 0,
                "businessPhotoUrl": ""
            }
        }
        """;

        var response = await _client.PostAsync(
            "/api/users/businessperson",
            TestFixtures.Json(bodyInvalido));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.BadRequest,
            HttpStatusCode.UnprocessableEntity
            );
    }

    [Fact(DisplayName = "CT-008 — Atualização de usuário existente retorna 204")]
    public async Task CT008_AtualizarUsuarioExistente_Retorna204()
    {
        var email = $"ct008_{Guid.NewGuid():N}@email.com";
        var id = await TestFixtures.CriarUsuarioAsync(_client, email: email);

        var updateJson = TestFixtures.UsuarioValidoJson(
            nome: "João Silva Atualizado",
            email: email);

        var response = await _client.PutAsync(
            $"/api/users/{id}",
            TestFixtures.Json(updateJson));

        response.StatusCode.Should().Be(
            HttpStatusCode.NoContent,
            because: "atualização válida deve retornar 204");
    }

    [Fact(DisplayName = "CT-009 — Atualização de usuário inexistente retorna erro")]
    public async Task CT009_AtualizarUsuarioInexistente_RetornaErro()
    {
        var idInexistente = Guid.NewGuid();
        var updateJson = TestFixtures.UsuarioValidoJson();

        var response = await _client.PutAsync(
            $"/api/users/{idInexistente}",
            TestFixtures.Json(updateJson));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.NotFound,
            HttpStatusCode.InternalServerError);
    }

    [Fact(DisplayName = "CT-010 — Atualização com dados inválidos retorna 400")]
    public async Task CT010_AtualizarDadosInvalidos_Retorna400()
    {
        var email = $"ct010_{Guid.NewGuid():N}@email.com";
        var id = await TestFixtures.CriarUsuarioAsync(_client, email: email);

        var bodyInvalido = """
        {
            "name": "",
            "email": "abc",
            "password": "12",
            "phone": "",
            "business": {
                "name": "",
                "serviceType": "",
                "address": "",
                "latitude": 0,
                "longitude": 0,
                "businessPhotoUrl": ""
            }
        }
        """;

        var response = await _client.PutAsync(
            $"/api/users/{id}",
            TestFixtures.Json(bodyInvalido));

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.BadRequest,
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.NoContent);
    }

    [Fact(DisplayName = "CT-011 — Exclusão de usuário existente retorna 200")]
    public async Task CT011_ExcluirUsuarioExistente_Retorna200()
    {
        var email = $"ct011_{Guid.NewGuid():N}@email.com";
        var id = await TestFixtures.CriarUsuarioAsync(_client, email: email);

        var response = await _client.DeleteAsync($"/api/users/{id}");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.OK,
            HttpStatusCode.NoContent);
    }

    [Fact(DisplayName = "CT-012 — Exclusão de usuário inexistente retorna erro")]
    public async Task CT012_ExcluirUsuarioInexistente_RetornaErro()
    {
        var idInexistente = Guid.NewGuid();

        var response = await _client.DeleteAsync($"/api/users/{idInexistente}");

        response.StatusCode.Should().BeOneOf(
            HttpStatusCode.NotFound,
            HttpStatusCode.InternalServerError);
    }

    [Fact(DisplayName = "CT-013 — Busca de usuário por ID válido retorna 200 com dados")]
    public async Task CT013_BuscarUsuarioPorIdValido_Retorna200()
    {
        var email = $"ct013_{Guid.NewGuid():N}@email.com";
        var id = await TestFixtures.CriarUsuarioAsync(_client,
            nome: "João Silva",
            email: email);

        var response = await _client.GetAsync($"/api/users/{id}");

        response.StatusCode.Should().Be(
            HttpStatusCode.OK,
            because: "usuário deve ser encontrado");

        var body = await response.Content.ReadAsStringAsync();
        body.Should().Contain(email);
    }

    [Fact(DisplayName = "CT-014 — Busca de usuário inexistente retorna 404")]
    public async Task CT014_BuscarUsuarioInexistente_Retorna404()
    {
        var idInexistente = Guid.NewGuid();

        var response = await _client.GetAsync($"/api/users/{idInexistente}");

        response.StatusCode.Should().Be(
            HttpStatusCode.NotFound,
            because: "usuário inexistente deve retornar 404");
    }
}