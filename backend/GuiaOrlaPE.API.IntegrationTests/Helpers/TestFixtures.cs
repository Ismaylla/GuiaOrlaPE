using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace GuiaOrlaPE.API.IntegrationTests.Helpers;

/// <summary>
/// Payloads e métodos utilitários reutilizados pelos 31 casos de teste.
/// </summary>
public static class TestFixtures
{
    // -------------------------------------------------------------------------
    // JSON padrão para criação de um usuário válido (CT-005, CT-001, etc.)
    // -------------------------------------------------------------------------
    public static string UsuarioValidoJson(
        string nome = "João Silva",
        string email = "joao@email.com",
        string senha = "123456",
        string phone = "81999999999") => $$"""
        {
            "name":     "{{nome}}",
            "email":    "{{email}}",
            "password": "{{senha}}",
            "phone":    "{{phone}}",
            "business": {
                "name":        "Restaurante Beira Mar",
                "serviceType": "BaresERestaurantes",
                "address":     "Av. Boa Viagem, 1000",
                "latitude":    -8.1178,
                "longitude":   -34.9006,
                "businessPhotoUrl": ""
            }
        }
        """;

    // -------------------------------------------------------------------------
    // JSON para criação de empreendimento adicional
    // -------------------------------------------------------------------------
    public static string NegocioValidoJson(
        string nome = "Restaurante Beira Mar",
        string tipo = "BaresERestaurantes",
        string endereco = "Av. Boa Viagem, 1000") => $$"""
        {
            "name":        "{{nome}}",
            "serviceType": "{{tipo}}",
            "address":     "{{endereco}}",
            "latitude":    -8.1178,
            "longitude":   -34.9006,
            "businessPhotoUrl": ""
        }
        """;

    // -------------------------------------------------------------------------
    // Monta um HttpContent com JSON
    // -------------------------------------------------------------------------
    public static StringContent Json(string json) =>
        new(json, Encoding.UTF8, "application/json");

    // -------------------------------------------------------------------------
    // Faz login e retorna o token JWT para requisições autenticadas
    // -------------------------------------------------------------------------
    public static async Task<string?> ObterTokenAsync(
        HttpClient client,
        string email = "joao@email.com",
        string senha = "123456")
    {
        var loginJson = $$"""{"email":"{{email}}","password":"{{senha}}"}""";
        var response = await client.PostAsync("/api/users/login", Json(loginJson));

        if (!response.IsSuccessStatusCode)
            return null;

        var body = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);
        return doc.RootElement.TryGetProperty("accessToken", out var tk)
            ? tk.GetString()
            : null;
    }

    // -------------------------------------------------------------------------
    // Cadastra um usuário e retorna o Guid gerado
    // -------------------------------------------------------------------------
    public static async Task<Guid> CriarUsuarioAsync(
        HttpClient client,
        string nome = "João Silva",
        string email = "joao@email.com",
        string senha = "123456")
    {
        var response = await client.PostAsync(
            "/api/users/businessperson",
            Json(UsuarioValidoJson(nome, email, senha)));

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);
        return doc.RootElement.GetProperty("id").GetGuid();
    }

    // -------------------------------------------------------------------------
    // Cadastra um empreendimento e retorna o Guid gerado
    // -------------------------------------------------------------------------
    public static async Task<Guid> CriarNegocioAsync(
        HttpClient client,
        Guid userId,
        string nome = "Restaurante Beira Mar")
    {
        var response = await client.PostAsync(
            "/api/business",
            Json($$"""
            {
                "userId":      "{{userId}}",
                "name":        "{{nome}}",
                "serviceType": "BaresERestaurantes",
                "address":     "Av. Boa Viagem, 1000",
                "latitude":    -8.1178,
                "longitude":   -34.9006,
                "businessPhotoUrl": ""
            }
            """));

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);
        return doc.RootElement.GetProperty("id").GetGuid();
    }
}