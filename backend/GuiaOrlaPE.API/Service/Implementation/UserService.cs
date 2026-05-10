using GuiaOrlaPE.API.Domain.Entities;
using GuiaOrlaPE.API.Domain.Enum;
using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Models.Responses;
using GuiaOrlaPE.API.Repository.Intefaces;
using GuiaOrlaPE.API.Service.Interfaces;

namespace GuiaOrlaPE.API.Service.Implementation;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;

    private readonly ITokenService _tokenService;

    public UserService(IUserRepository repository, ITokenService tokenService)
    {
        _repository = repository;
        _tokenService = tokenService;
    }

    public async Task<User> CreateBusinesspersonAsync(CreateBusinesspersonRequest request)
    {
        var existingUser = await _repository.GetByEmailAsync(request.Email);

        if (existingUser is not null)
            throw new Exception("Email já cadastrado.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Profile = UserProfileEnum.Businessperson,
            Status = true,
            CreatedAt = DateTime.UtcNow,
            Businesses =
            [
                new Business
                {
                    Id = Guid.NewGuid(),
                    Name = request.Business.Name,
                    ServiceType = request.Business.ServiceType,
                    Address = request.Business.Address,
                    Latitude = request.Business.Latitude,
                    Longitude = request.Business.Longitude,
                    BusinessPhotoUrl = request.Business.BusinessPhotoUrl
                }
            ]
        };

        await _repository.CreateAsync(user);

        return user;
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task UpdateAsync(Guid id, CreateBusinesspersonRequest request)
    {
        var user = await _repository.GetByIdAsync(id);

        if (user is null)
            throw new Exception("Usuário não encontrado.");

        user.Name = request.Name;
        user.Phone = request.Phone;

        await _repository.UpdateAsync(user);
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _repository.GetByEmailAsync(request.Email);

        if (user is null)
            throw new Exception("Email ou senha inválidos.");

        var passwordIsValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash);

        if (!passwordIsValid)
            throw new Exception("Email ou senha inválidos.");

        if (!user.Status)
            throw new Exception("Usuário inativo.");

        var token = _tokenService.GenerateToken(user);

        return new LoginResponse
        {
            AccessToken = token,
            ExpiresAt = DateTime.UtcNow.AddHours(2),

            User = new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Profile = user.Profile.ToString()
            }
        };
    }
}
