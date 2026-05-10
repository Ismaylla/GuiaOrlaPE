using GuiaOrlaPE.API.Domain.Entities;

namespace GuiaOrlaPE.API.Repository.Intefaces;

public interface IBusinessRepository
{
    Task<List<Business>> GetAllAsync();

    Task<Business?> GetByIdAsync(Guid id);
}
