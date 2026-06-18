using GuiaOrlaPE.API.Domain.Entities;
using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Models.Responses;

namespace GuiaOrlaPE.API.Service.Interfaces;

public interface IUserService
{
    Task<User> CreateBusinesspersonAsync(CreateBusinesspersonRequest request);

    Task<List<User>> GetAllAsync();

    Task<User?> GetByIdAsync(Guid id);

    Task UpdateAsync(Guid id, CreateBusinesspersonRequest request);

    Task<LoginResponse> LoginAsync(LoginRequest request);

    Task ForgotPasswordAsync(string email);
    Task UpdateEmailAsync(Guid userId, string newEmail);

    Task ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
    Task DeleteAsync(Guid id);
}
