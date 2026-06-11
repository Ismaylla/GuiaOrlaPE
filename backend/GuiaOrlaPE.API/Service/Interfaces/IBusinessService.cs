// using GuiaOrlaPE.API.Models.Requests;
// using GuiaOrlaPE.API.Models.Responses;

// namespace GuiaOrlaPE.API.Service.Interfaces;

// public interface IBusinessService
// {
//     Task<List<BusinessResponse>> GetAllAsync();

//     Task<BusinessResponse?> GetByIdAsync(Guid id);

//     Task<PagedResponse<BusinessResponse>> SearchAsync(SearchBusinessRequest request);

//     Task<PagedResponse<BusinessResponse>> GetByUserIdAsync(Guid userId, PaginationRequest request);

//     Task<BusinessResponse> CreateAsync(CreateBusinessRequest request, Guid userId);
// }

using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Models.Responses;

namespace GuiaOrlaPE.API.Service.Interfaces;

public interface IBusinessService
{
    Task<List<BusinessResponse>> GetAllAsync();

    Task<BusinessResponse?> GetByIdAsync(Guid id);

    Task<PagedResponse<BusinessResponse>> SearchAsync(SearchBusinessRequest request);

    Task<PagedResponse<BusinessResponse>> GetByUserIdAsync(Guid userId, PaginationRequest request);

    Task<BusinessResponse> CreateAsync(CreateBusinessRequest request, Guid userId);
}