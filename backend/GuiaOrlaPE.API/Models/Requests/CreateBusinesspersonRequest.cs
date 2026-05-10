namespace GuiaOrlaPE.API.Models.Requests;

public class CreateBusinesspersonRequest
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public CreateBusinessRequest Business { get; set; } = null!;
}
