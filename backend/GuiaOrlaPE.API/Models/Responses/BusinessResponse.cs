using GuiaOrlaPE.API.Domain.Enum;

namespace GuiaOrlaPE.API.Models.Responses;

public class BusinessResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public BusinessServiceTypeEnum ServiceType { get; set; }

    public string Address { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public string BusinessPhotoUrl { get; set; } = string.Empty;

    public string Horario { get; set; } = string.Empty;

    // Campos de pagamento que adicionei para a resposta
    public bool Cartao { get; set; }

    public bool Pix { get; set; }

    public bool Dinheiro { get; set; }

    // Campos de comodidades que adicionei para a resposta
    public bool Chuveiro { get; set; }

    public bool Estacionamento { get; set; }

    public bool Cadeira { get; set; }

    public bool PetFriendly { get; set; }

    public bool Acessibilidade { get; set; }

    public bool Wifi { get; set; }

    public BusinessOwnerResponse Owner { get; set; } = null!;
}

public class BusinessOwnerResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;
}