using GuiaOrlaPE.API.Domain.Enum;

namespace GuiaOrlaPE.API.Models.Requests;

public class CreateBusinessRequest
{
    public string Name { get; set; } = string.Empty;

    public BusinessServiceTypeEnum ServiceType { get; set; }

    public string Address { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public string BusinessPhotoUrl { get; set; } = string.Empty;
}
