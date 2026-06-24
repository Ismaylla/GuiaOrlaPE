namespace GuiaOrlaPE.API.Tests.Fixtures;

public class UserServiceFixture
{
    public Mock<IUserRepository> UserRepositoryMock { get; set; }
    public Mock<ITokenService> TokenServiceMock { get; set; }
    public Mock<IEmailService> EmailServiceMock { get; set; }
    public GuiaOrlaPE.API.Service.Implementation.UserService UserService { get; set; }

    public UserServiceFixture()
    {
        UserRepositoryMock = new Mock<IUserRepository>();
        TokenServiceMock = new Mock<ITokenService>();
        EmailServiceMock = new Mock<IEmailService>();
        UserService = new GuiaOrlaPE.API.Service.Implementation.UserService(
            UserRepositoryMock.Object,
            TokenServiceMock.Object,
            EmailServiceMock.Object);
    }

    public void ResetMocks()
    {
        UserRepositoryMock.Reset();
        TokenServiceMock.Reset();
        EmailServiceMock.Reset();
    }

    public static CreateBusinesspersonRequest CreateValidRequest()
    {
        return new CreateBusinesspersonRequest
        {
            Name = "João Silva",
            Email = "joao@example.com",
            Password = "SenhaSegura@123",
            Phone = "85987654321",
            Business = new CreateBusinessRequest
            {
                Name = "Restaurante João",
                ServiceType = BusinessServiceTypeEnum.BaresERestaurantes,
                Address = "Rua das Flores, 123",
                Latitude = -3.1190,
                Longitude = -60.0217,
                BusinessPhotoUrl = "https://example.com/photo.jpg"
            }
        };
    }

    public static User CreateValidUser()
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Name = "João Silva",
            Email = "joao@example.com",
            Phone = "85987654321",
            PasswordHash = "$2a$11$example_hash",
            Profile = UserProfileEnum.Businessperson,
            Status = true,
            CreatedAt = DateTime.UtcNow,
            Businesses = []
        };
    }
}
