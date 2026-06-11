using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Models.Responses;
using GuiaOrlaPE.API.Repository.Intefaces;
using GuiaOrlaPE.API.Service.Interfaces;
using GuiaOrlaPE.API.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace GuiaOrlaPE.API.Service.Implementation;

public class BusinessService(
    IBusinessRepository repository,
    ILogger<BusinessService> logger) : IBusinessService
{
    private readonly IBusinessRepository _repository = repository;
    private readonly ILogger<BusinessService> _logger = logger;

    public async Task<List<BusinessResponse>> GetAllAsync()
    {
        try
        {
            _logger.LogInformation("Iniciando busca de todos os empreendimentos.");

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

            _logger.LogInformation("Foram encontrados {Count} empreendimentos.", response.Count);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar empreendimentos.");
            throw;
        }
    }

    public async Task<BusinessResponse?> GetByIdAsync(Guid id)
    {
        try
        {
            _logger.LogInformation("Buscando empreendimento {BusinessId}", id);

            var business = await _repository.GetByIdAsync(id);

            if (business is null)
            {
                _logger.LogWarning("Empreendimento {BusinessId} não encontrado.", id);
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
            _logger.LogError(ex, "Erro ao buscar empreendimento {BusinessId}", id);
            throw;
        }
    }

    public async Task<PagedResponse<BusinessResponse>> SearchAsync(SearchBusinessRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Iniciando busca paginada de empreendimentos. Search: {Search}, Categoria: {Categoria}, Localizacao: {Localizacao}, Page: {Page}",
                request.Search, request.Categoria, request.Localizacao, request.Page);

            var (items, totalItems) = await _repository.SearchAsync(request);

            var responseItems = items.Select(x => new BusinessResponse
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

            var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);

            _logger.LogInformation("Busca paginada realizada com sucesso. TotalItems: {TotalItems}", totalItems);

            return new PagedResponse<BusinessResponse>
            {
                Items = responseItems,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao realizar busca paginada de empreendimentos.");
            throw;
        }
    }

    public async Task<PagedResponse<BusinessResponse>> GetByUserIdAsync(Guid userId, PaginationRequest request)
    {
        try
        {
            _logger.LogInformation("Buscando empreendimentos do usuário. UserId: {UserId}", userId);

            var (items, totalItems) = await _repository.GetByUserIdAsync(userId, request.Page, request.PageSize);

            var responseItems = items.Select(x => new BusinessResponse
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

            var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);

            _logger.LogInformation("Foram encontrados {Count} empreendimentos para o usuário {UserId}", totalItems, userId);

            return new PagedResponse<BusinessResponse>
            {
                Items = responseItems,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar empreendimentos do usuário. UserId: {UserId}", userId);
            throw;
        }
    }

    // AJUSTADO: Assinatura corrigida com dois parâmetros e gravação real no banco de dados
    public async Task<BusinessResponse> CreateAsync(CreateBusinessRequest request, Guid userId)
    {
        try
        {
            _logger.LogInformation("Iniciando criação real do negócio: {Name} para o usuário {UserId}", request.Name, userId);

            var business = new Business
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = request.Name,
                ServiceType = request.ServiceType,
                Address = request.Address,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                BusinessPhotoUrl = request.BusinessPhotoUrl,
                Status = true,
                Cartao = request.Cartao,
                Pix = request.Pix,
                Dinheiro = request.Dinheiro,
                Chuveiro = request.Chuveiro,
                Estacionamento = request.Estacionamento,
                Cadeira = request.Cadeira,
                PetFriendly = request.PetFriendly,
                Acessibilidade = request.Acessibilidade,
                Horario = request.Horario
            };

            await _repository.AddAsync(business);

            return new BusinessResponse
            {
                Id = business.Id,
                Name = business.Name,
                ServiceType = business.ServiceType,
                Address = business.Address,
                Latitude = business.Latitude,
                Longitude = business.Longitude,
                BusinessPhotoUrl = business.BusinessPhotoUrl,
                Cartao = business.Cartao,
                Pix = business.Pix,
                Dinheiro = business.Dinheiro,
                Chuveiro = business.Chuveiro,
                Estacionamento = business.Estacionamento,
                Cadeira = business.Cadeira,
                PetFriendly = business.PetFriendly,
                Acessibilidade = business.Acessibilidade,
                Horario = business.Horario,
                Owner = new BusinessOwnerResponse 
                { 
                    Id = userId 
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no service ao criar novo empreendimento.");
            throw;
        }
    }
}