// using GuiaOrlaPE.API.Models.Requests;
// using GuiaOrlaPE.API.Models.Responses;
// using GuiaOrlaPE.API.Repository.Intefaces;
// using GuiaOrlaPE.API.Service.Interfaces;
// using GuiaOrlaPE.API.Domain.Entities;
// using Microsoft.Extensions.Logging;

// namespace GuiaOrlaPE.API.Service.Implementation;

// public class BusinessService(
//     IBusinessRepository repository,
//     ILogger<BusinessService> logger) : IBusinessService
// {
//     private readonly IBusinessRepository _repository = repository;
//     private readonly ILogger<BusinessService> _logger = logger;

//     public async Task<List<BusinessResponse>> GetAllAsync()
//     {
//         try
//         {
//             var businesses = await _repository.GetAllAsync();
//             return businesses.Select(x => new BusinessResponse
//             {
//                 Id = x.Id, 
//                 UserId = x.UserId,
//                 Name = x.Name, ServiceType = x.ServiceType, Address = x.Address,
//                 Latitude = x.Latitude, Longitude = x.Longitude, BusinessPhotoUrl = x.BusinessPhotoUrl,
//                 Horario = x.Horario, Cartao = x.Cartao, Pix = x.Pix, Dinheiro = x.Dinheiro,
//                 Chuveiro = x.Chuveiro, Estacionamento = x.Estacionamento, Cadeira = x.Cadeira,
//                 PetFriendly = x.PetFriendly, Acessibilidade = x.Acessibilidade, Wifi = x.Wifi,
//                 Description = x.Description, // 👈 MAPEADO
//                 GalleryPhotos = x.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], // 👈 MAPEADO
//                 Owner = new BusinessOwnerResponse { Id = x.User.Id, Name = x.User.Name, Email = x.User.Email, Phone = x.User.Phone }
//             }).ToList();
//         }
//         catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
//     }

//     public async Task<BusinessResponse?> GetByIdAsync(Guid id)
//     {
//         _logger.LogInformation("--- BUSCANDO NEGOCIO ID: {id} ---", id);
//         try
//         {
//             var business = await _repository.GetByIdAsync(id);
//             if (business is null) return null;

//             return new BusinessResponse
//             {
//                 Id = business.Id, 
//                 UserId = business.UserId,
//                 Name = business.Name, ServiceType = business.ServiceType, Address = business.Address,
//                 Latitude = business.Latitude, Longitude = business.Longitude, BusinessPhotoUrl = business.BusinessPhotoUrl,
//                 Horario = business.Horario, Cartao = business.Cartao, Pix = business.Pix, Dinheiro = business.Dinheiro,
//                 Chuveiro = business.Chuveiro, Estacionamento = business.Estacionamento, Cadeira = business.Cadeira,
//                 PetFriendly = business.PetFriendly, Acessibilidade = business.Acessibilidade, Wifi = business.Wifi,
//                 Description = business.Description, // 👈 MAPEADO
//                 GalleryPhotos = business.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], // 👈 MAPEADO
//                 Owner = new BusinessOwnerResponse { Id = business.User.Id, Name = business.User.Name, Email = business.User.Email, Phone = business.User.Phone }
//             };
//         }
//         catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
//     }

//     public async Task<PagedResponse<BusinessResponse>> SearchAsync(SearchBusinessRequest request)
//     {
//         try
//         {
//             var (items, totalItems) = await _repository.SearchAsync(request);
//             var responseItems = items.Select(x => new BusinessResponse
//             {
//                 Id = x.Id, 
//                 UserId = x.UserId,
//                 Name = x.Name, ServiceType = x.ServiceType, Address = x.Address,
//                 Latitude = x.Latitude, Longitude = x.Longitude, BusinessPhotoUrl = x.BusinessPhotoUrl,
//                 Horario = x.Horario, Cartao = x.Cartao, Pix = x.Pix, Dinheiro = x.Dinheiro,
//                 Chuveiro = x.Chuveiro, Estacionamento = x.Estacionamento, Cadeira = x.Cadeira,
//                 PetFriendly = x.PetFriendly, Acessibilidade = x.Acessibilidade, Wifi = x.Wifi,
//                 Description = x.Description, // 👈 MAPEADO
//                 GalleryPhotos = x.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], // 👈 MAPEADO
//                 Owner = new BusinessOwnerResponse { Id = x.User.Id, Name = x.User.Name, Email = x.User.Email, Phone = x.User.Phone }
//             }).ToList();

//             var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);
//             return new PagedResponse<BusinessResponse> { Items = responseItems, Page = request.Page, PageSize = request.PageSize, TotalItems = totalItems, TotalPages = totalPages, HasNextPage = request.Page < totalPages, HasPreviousPage = request.Page > 1 };
//         }
//         catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
//     }

//     public async Task<PagedResponse<BusinessResponse>> GetByUserIdAsync(Guid userId, PaginationRequest request)
//     {
//         try
//         {
//             var (items, totalItems) = await _repository.GetByUserIdAsync(userId, request.Page, request.PageSize);
            
//             var responseItems = items.Select(x => {
//                 var resp = new BusinessResponse
//                 {
//                     Id = x.Id, 
//                     UserId = x.UserId,
//                     Name = x.Name, ServiceType = x.ServiceType, Address = x.Address,
//                     Latitude = x.Latitude, Longitude = x.Longitude, BusinessPhotoUrl = x.BusinessPhotoUrl,
//                     Horario = x.Horario, Cartao = x.Cartao, Pix = x.Pix, Dinheiro = x.Dinheiro,
//                     Chuveiro = x.Chuveiro, Estacionamento = x.Estacionamento, Cadeira = x.Cadeira,
//                     PetFriendly = x.PetFriendly, Acessibilidade = x.Acessibilidade, Wifi = x.Wifi,
//                     Description = x.Description, // 👈 MAPEADO
//                     GalleryPhotos = x.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], // 👈 MAPEADO
//                     Owner = new BusinessOwnerResponse { Id = x.User.Id, Name = x.User.Name, Email = x.User.Email, Phone = x.User.Phone }
//                 };
//                 return resp;
//             }).ToList();

//             var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);
//             return new PagedResponse<BusinessResponse> { Items = responseItems, Page = request.Page, PageSize = request.PageSize, TotalItems = totalItems, TotalPages = totalPages, HasNextPage = request.Page < totalPages, HasPreviousPage = request.Page > 1 };
//         }
//         catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
//     }

//     public async Task<BusinessResponse> CreateAsync(CreateBusinessRequest request, Guid userId)
//     {
//         try
//         {
//             var business = new Business
//             {
//                 Id = Guid.NewGuid(), UserId = userId, Name = request.Name, ServiceType = request.ServiceType,
//                 Address = request.Address, Latitude = request.Latitude, Longitude = request.Longitude,
//                 BusinessPhotoUrl = request.BusinessPhotoUrl, Status = true, Horario = request.Horario,
//                 Cartao = request.Cartao, Pix = request.Pix, Dinheiro = request.Dinheiro,
//                 Chuveiro = request.Chuveiro, Estacionamento = request.Estacionamento, Cadeira = request.Cadeira,
//                 PetFriendly = request.PetFriendly, Acessibilidade = request.Acessibilidade, Wifi = request.Wifi,
//                 Description = string.Empty
//             };

//             await _repository.AddAsync(business);
//             return new BusinessResponse { Id = business.Id, UserId = business.UserId, Name = business.Name, ServiceType = business.ServiceType, Address = business.Address, Latitude = business.Latitude, Longitude = business.Longitude, BusinessPhotoUrl = business.BusinessPhotoUrl, Horario = business.Horario, Cartao = business.Cartao, Pix = business.Pix, Dinheiro = business.Dinheiro, Chuveiro = business.Chuveiro, Estacionamento = business.Estacionamento, Cadeira = business.Cadeira, PetFriendly = business.PetFriendly, Acessibilidade = business.Acessibilidade, Wifi = business.Wifi, Description = business.Description, GalleryPhotos = [], Owner = new BusinessOwnerResponse { Id = userId } };
//         }
//         catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
//     }

//     public async Task UpdateAsync(Guid id, CreateBusinessRequest request, Guid userId)
//     {
//         try
//         {
//             var business = await _repository.GetByIdAsync(id);
//             if (business == null) throw new KeyNotFoundException("Não encontrado.");

//             business.Name = request.Name; business.ServiceType = request.ServiceType;
//             business.Address = request.Address; business.Latitude = request.Latitude;
//             business.Longitude = request.Longitude; business.BusinessPhotoUrl = request.BusinessPhotoUrl;
//             business.Horario = request.Horario; business.Cartao = request.Cartao;
//             business.Pix = request.Pix; business.Dinheiro = request.Dinheiro;
//             business.Chuveiro = request.Chuveiro; business.Estacionamento = request.Estacionamento;
//             business.Cadeira = request.Cadeira; business.PetFriendly = request.PetFriendly;
//             business.Acessibilidade = request.Acessibilidade;
//             business.Wifi = request.Wifi;

//             await _repository.UpdateAsync(business);
//         }
//         catch (Exception ex) { _logger.LogError(ex, "Erro ao atualizar."); throw; }
//     }
// }

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
            var businesses = await _repository.GetAllAsync();
            return businesses.Select(x => new BusinessResponse
            {
                Id = x.Id, 
                UserId = x.UserId,
                Name = x.Name, ServiceType = x.ServiceType, Address = x.Address,
                Latitude = x.Latitude, Longitude = x.Longitude, 
                BusinessPhotoUrl = x.BusinessPhotoUrl,
                CoverPhotoUrl = x.CoverPhotoUrl, // 👈 ADICIONADO
                Horario = x.Horario, Cartao = x.Cartao, Pix = x.Pix, Dinheiro = x.Dinheiro,
                Chuveiro = x.Chuveiro, Estacionamento = x.Estacionamento, Cadeira = x.Cadeira,
                PetFriendly = x.PetFriendly, Acessibilidade = x.Acessibilidade, Wifi = x.Wifi,
                Description = x.Description, 
                GalleryPhotos = x.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], 
                Owner = new BusinessOwnerResponse { Id = x.User.Id, Name = x.User.Name, Email = x.User.Email, Phone = x.User.Phone }
            }).ToList();
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
    }

    public async Task<BusinessResponse?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("--- BUSCANDO NEGOCIO ID: {id} ---", id);
        try
        {
            var business = await _repository.GetByIdAsync(id);
            if (business is null) return null;

            return new BusinessResponse
            {
                Id = business.Id, 
                UserId = business.UserId,
                Name = business.Name, ServiceType = business.ServiceType, Address = business.Address,
                Latitude = business.Latitude, Longitude = business.Longitude, 
                BusinessPhotoUrl = business.BusinessPhotoUrl,
                CoverPhotoUrl = business.CoverPhotoUrl, // 👈 ADICIONADO
                Horario = business.Horario, Cartao = business.Cartao, Pix = business.Pix, Dinheiro = business.Dinheiro,
                Chuveiro = business.Chuveiro, Estacionamento = business.Estacionamento, Cadeira = business.Cadeira,
                PetFriendly = business.PetFriendly, Acessibilidade = business.Acessibilidade, Wifi = business.Wifi,
                Description = business.Description, 
                GalleryPhotos = business.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], 
                Owner = new BusinessOwnerResponse { Id = business.User.Id, Name = business.User.Name, Email = business.User.Email, Phone = business.User.Phone }
            };
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
    }

    public async Task<PagedResponse<BusinessResponse>> SearchAsync(SearchBusinessRequest request)
    {
        try
        {
            var (items, totalItems) = await _repository.SearchAsync(request);
            var responseItems = items.Select(x => new BusinessResponse
            {
                Id = x.Id, 
                UserId = x.UserId,
                Name = x.Name, ServiceType = x.ServiceType, Address = x.Address,
                Latitude = x.Latitude, Longitude = x.Longitude, 
                BusinessPhotoUrl = x.BusinessPhotoUrl,
                CoverPhotoUrl = x.CoverPhotoUrl, // 👈 ADICIONADO
                Horario = x.Horario, Cartao = x.Cartao, Pix = x.Pix, Dinheiro = x.Dinheiro,
                Chuveiro = x.Chuveiro, Estacionamento = x.Estacionamento, Cadeira = x.Cadeira,
                PetFriendly = x.PetFriendly, Acessibilidade = x.Acessibilidade, Wifi = x.Wifi,
                Description = x.Description, 
                GalleryPhotos = x.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], 
                Owner = new BusinessOwnerResponse { Id = x.User.Id, Name = x.User.Name, Email = x.User.Email, Phone = x.User.Phone }
            }).ToList();

            var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);
            return new PagedResponse<BusinessResponse> { Items = responseItems, Page = request.Page, PageSize = request.PageSize, TotalItems = totalItems, TotalPages = totalPages, HasNextPage = request.Page < totalPages, HasPreviousPage = request.Page > 1 };
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
    }

    public async Task<PagedResponse<BusinessResponse>> GetByUserIdAsync(Guid userId, PaginationRequest request)
    {
        try
        {
            var (items, totalItems) = await _repository.GetByUserIdAsync(userId, request.Page, request.PageSize);
            
            var responseItems = items.Select(x => {
                var resp = new BusinessResponse
                {
                    Id = x.Id, 
                    UserId = x.UserId,
                    Name = x.Name, ServiceType = x.ServiceType, Address = x.Address,
                    Latitude = x.Latitude, Longitude = x.Longitude, 
                    BusinessPhotoUrl = x.BusinessPhotoUrl,
                    CoverPhotoUrl = x.CoverPhotoUrl, // 👈 ADICIONADO
                    Horario = x.Horario, Cartao = x.Cartao, Pix = x.Pix, Dinheiro = x.Dinheiro,
                    Chuveiro = x.Chuveiro, Estacionamento = x.Estacionamento, Cadeira = x.Cadeira,
                    PetFriendly = x.PetFriendly, Acessibilidade = x.Acessibilidade, Wifi = x.Wifi,
                    Description = x.Description, 
                    GalleryPhotos = x.Photos?.Select(p => p.PhotoUrl).ToList() ?? [], 
                    Owner = new BusinessOwnerResponse { Id = x.User.Id, Name = x.User.Name, Email = x.User.Email, Phone = x.User.Phone }
                };
                return resp;
            }).ToList();

            var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);
            return new PagedResponse<BusinessResponse> { Items = responseItems, Page = request.Page, PageSize = request.PageSize, TotalItems = totalItems, TotalPages = totalPages, HasNextPage = request.Page < totalPages, HasPreviousPage = request.Page > 1 };
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
    }

    public async Task<BusinessResponse> CreateAsync(CreateBusinessRequest request, Guid userId)
    {
        try
        {
            var business = new Business
            {
                Id = Guid.NewGuid(), UserId = userId, Name = request.Name, ServiceType = request.ServiceType,
                Address = request.Address, Latitude = request.Latitude, Longitude = request.Longitude,
                BusinessPhotoUrl = request.BusinessPhotoUrl,
                CoverPhotoUrl = string.Empty, // 👈 ADICIONADO: Nasce vazia no banco
                Status = true, Horario = request.Horario,
                Cartao = request.Cartao, Pix = request.Pix, Dinheiro = request.Dinheiro,
                Chuveiro = request.Chuveiro, Estacionamento = request.Estacionamento, Cadeira = request.Cadeira,
                PetFriendly = request.PetFriendly, Acessibilidade = request.Acessibilidade, Wifi = request.Wifi,
                Description = string.Empty
            };

            await _repository.AddAsync(business);
            return new BusinessResponse { Id = business.Id, UserId = business.UserId, Name = business.Name, ServiceType = business.ServiceType, Address = business.Address, Latitude = business.Latitude, Longitude = business.Longitude, BusinessPhotoUrl = business.BusinessPhotoUrl, CoverPhotoUrl = business.CoverPhotoUrl, Horario = business.Horario, Cartao = business.Cartao, Pix = business.Pix, Dinheiro = business.Dinheiro, Chuveiro = business.Chuveiro, Estacionamento = business.Estacionamento, Cadeira = business.Cadeira, PetFriendly = business.PetFriendly, Acessibilidade = business.Acessibilidade, Wifi = business.Wifi, Description = business.Description, GalleryPhotos = [], Owner = new BusinessOwnerResponse { Id = userId } };
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); throw; }
    }

    public async Task UpdateAsync(Guid id, CreateBusinessRequest request, Guid userId)
    {
        try
        {
            var business = await _repository.GetByIdAsync(id);
            if (business == null) throw new KeyNotFoundException("Não encontrado.");

            business.Name = request.Name; business.ServiceType = request.ServiceType;
            business.Address = request.Address; business.Latitude = request.Latitude;
            business.Longitude = request.Longitude; business.BusinessPhotoUrl = request.BusinessPhotoUrl;
            business.Horario = request.Horario; business.Cartao = request.Cartao;
            business.Pix = request.Pix; business.Dinheiro = request.Dinheiro;
            business.Chuveiro = request.Chuveiro; business.Estacionamento = request.Estacionamento;
            business.Cadeira = request.Cadeira; business.PetFriendly = request.PetFriendly;
            business.Acessibilidade = request.Acessibilidade;
            business.Wifi = request.Wifi;

            await _repository.UpdateAsync(business);
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro ao atualizar."); throw; }
    }
}