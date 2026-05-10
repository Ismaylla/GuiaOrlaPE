using GuiaOrlaPE.API.Models.Responses;
using GuiaOrlaPE.API.Repository.Intefaces;
using GuiaOrlaPE.API.Service.Interfaces;

namespace GuiaOrlaPE.API.Service.Implementation;

public class BusinessService : IBusinessService
{
    private readonly IBusinessRepository _repository;

    private readonly ILogger<BusinessService> _logger;

    public BusinessService(
        IBusinessRepository repository,
        ILogger<BusinessService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<List<BusinessResponse>> GetAllAsync()
    {
        try
        {
            _logger.LogInformation(
                "Iniciando busca de todos os empreendimentos.");

            var businesses = await _repository.GetAllAsync();

            var response = businesses.Select(x => new BusinessResponse
            {
                Id = x.Id,
                Name = x.Name,
                ServiceType = x.ServiceType,
                Address = x.Address,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                BusinessPhotoUrl = x.BusinessPhotoUrl,

                Owner = new BusinessOwnerResponse
                {
                    Id = x.User.Id,
                    Name = x.User.Name,
                    Email = x.User.Email,
                    Phone = x.User.Phone
                }
            }).ToList();

            _logger.LogInformation(
                "Foram encontrados {Count} empreendimentos.",
                response.Count);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao buscar empreendimentos.");

            throw;
        }
    }

    public async Task<BusinessResponse?> GetByIdAsync(Guid id)
    {
        try
        {
            _logger.LogInformation(
                "Buscando empreendimento {BusinessId}",
                id);

            var business = await _repository.GetByIdAsync(id);

            if (business is null)
            {
                _logger.LogWarning(
                    "Empreendimento {BusinessId} não encontrado.",
                    id);

                return null;
            }

            return new BusinessResponse
            {
                Id = business.Id,
                Name = business.Name,
                ServiceType = business.ServiceType,
                Address = business.Address,
                Latitude = business.Latitude,
                Longitude = business.Longitude,
                BusinessPhotoUrl = business.BusinessPhotoUrl,

                Owner = new BusinessOwnerResponse
                {
                    Id = business.User.Id,
                    Name = business.User.Name,
                    Email = business.User.Email,
                    Phone = business.User.Phone
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao buscar empreendimento {BusinessId}",
                id);

            throw;
        }
    }
}
