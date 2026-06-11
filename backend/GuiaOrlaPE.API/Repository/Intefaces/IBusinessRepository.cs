using GuiaOrlaPE.API.Domain.Entities;
using GuiaOrlaPE.API.Models.Requests;

namespace GuiaOrlaPE.API.Repository.Intefaces;

public interface IBusinessRepository
{
    Task<List<Business>> GetAllAsync();

    Task<Business?> GetByIdAsync(Guid id);

    // Mudamos para 'Items' e 'TotalItems' com iniciais maiúsculas aqui para corrigri erro no repository
    Task<(List<Business> Items, int TotalItems)> SearchAsync(SearchBusinessRequest request);

    Task<(List<Business> Items, int TotalItems)> GetByUserIdAsync(Guid userId, int page, int pageSize);

    Task AddAsync(Business business);

    
}