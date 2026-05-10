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

    public BusinessOwnerResponse Owner { get; set; } = null!;
}

public class BusinessOwnerResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;
}