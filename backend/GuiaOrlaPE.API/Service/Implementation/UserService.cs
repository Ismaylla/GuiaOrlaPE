using GuiaOrlaPE.API.Domain.Entities;
using GuiaOrlaPE.API.Domain.Enum;
using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Models.Responses;
using GuiaOrlaPE.API.Repository.Intefaces;
using GuiaOrlaPE.API.Service.Interfaces;

namespace GuiaOrlaPE.API.Service.Implementation;

public class UserService(IUserRepository repository, ITokenService tokenService, IEmailService emailService) : IUserService
{
    private readonly IUserRepository _repository = repository;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IEmailService _emailService = emailService;

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
        var user = await _repository.GetByIdAsync(id) ?? throw new Exception("Usuário não encontrado.");
        user.Name = request.Name;
        user.Phone = request.Phone;

        await _repository.UpdateAsync(user);
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _repository.GetByEmailAsync(request.Email) ?? throw new Exception("Email ou senha inválidos.");

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

    public async Task ForgotPasswordAsync(string email)
    {
        var user = await _repository.GetByEmailAsync(email) ?? throw new Exception("Usuário não encontrado.");

        // Gera uma senha temporária de 8 caracteres
        var novaSenhaTemp = Guid.NewGuid().ToString()[..8];

        // Atualiza o hash no banco
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(novaSenhaTemp);
        await _repository.UpdateAsync(user);

        // Envia o e-mail
        var corpo = $@"
            <h2>Recuperação de Senha - GuiaOrlaPE</h2>
            <p>Olá, {user.Name}.</p>
            <p>Recebemos uma solicitação para redefinir sua senha. Sua nova senha temporária é: <b>{novaSenhaTemp}</b></p>
            <p><b>AVISO IMPORTANTE:</b> Esta senha é temporária. Recomendamos que você a altere assim que fizer login.</p>
            <p>Nunca compartilhe esta senha com ninguém.</p>";

        await _emailService.SendAsync(email, "Redefinição de Senha - GuiaOrlaPE", corpo);
    }


}
