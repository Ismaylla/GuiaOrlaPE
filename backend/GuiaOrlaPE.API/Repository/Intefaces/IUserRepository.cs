using GuiaOrlaPE.API.Domain.Entities;

namespace GuiaOrlaPE.API.Repository.Intefaces;

public interface IUserRepository
{
    Task CreateAsync(User user);

    Task<User?> GetByIdAsync(Guid id);

    Task<User?> GetByEmailAsync(string email);

    Task<List<User>> GetAllAsync();

    Task UpdateAsync(User user);

    Task DeleteAsync(User user);


}
