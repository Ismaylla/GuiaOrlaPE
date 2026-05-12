using GuiaOrlaPE.API.Domain.Entities;

namespace GuiaOrlaPE.API.Repository.Intefaces;

public interface IBusinessRepository
{
    Task<List<Business>> GetAllAsync();

    Task<Business?> GetByIdAsync(Guid id);

    Task<(List<Business> Items, int TotalItems)> SearchAsync(string? search, int page, int pageSize);

    Task<(List<Business> Items, int TotalItems)> GetByUserIdAsync(Guid userId, int page, int pageSize);

}
