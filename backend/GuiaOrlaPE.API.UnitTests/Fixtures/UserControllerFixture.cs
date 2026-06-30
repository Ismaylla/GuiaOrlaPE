namespace GuiaOrlaPE.API.UnitTests.Fixtures;

public class UserControllerFixture
{
    public Mock<IUserService> UserServiceMock { get; set; }
    public Mock<IBusinessService> BusinessServiceMock { get; set; }
    public Mock<ITokenService> TokenServiceMock { get; set; }
    public Mock<ILogger<GuiaOrlaPE.API.Controller.UserController>> LoggerMock { get; set; }
    public GuiaOrlaPE.API.Controller.UserController UserController { get; set; }

    public UserControllerFixture()
    {
        UserServiceMock = new Mock<IUserService>();
        BusinessServiceMock = new Mock<IBusinessService>();
        TokenServiceMock = new Mock<ITokenService>();
        LoggerMock = new Mock<ILogger<GuiaOrlaPE.API.Controller.UserController>>();

        UserController = new GuiaOrlaPE.API.Controller.UserController(
            UserServiceMock.Object,
            BusinessServiceMock.Object,
            TokenServiceMock.Object,
            LoggerMock.Object);
    }

    public void ResetMocks()
    {
        UserServiceMock.Reset();
        BusinessServiceMock.Reset();
        TokenServiceMock.Reset();
        LoggerMock.Reset();
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

    public static LoginRequest CreateValidLoginRequest()
    {
        return new LoginRequest
        {
            Email = "joao@example.com",
            Password = "SenhaSegura@123"
        };
    }
}
