using GuiaOrlaPE.API.Domain.Entities;

namespace GuiaOrlaPE.API.Service.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
