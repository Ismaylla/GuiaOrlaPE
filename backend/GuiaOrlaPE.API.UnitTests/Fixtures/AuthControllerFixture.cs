namespace GuiaOrlaPE.API.UnitTests.Fixtures;

public class AuthControllerFixture
{
    public Mock<IUserService> UserServiceMock { get; set; }
    public Mock<ILogger<GuiaOrlaPE.API.Controller.AuthController>> LoggerMock { get; set; }
    public GuiaOrlaPE.API.Controller.AuthController AuthController { get; set; }

    public AuthControllerFixture()
    {
        UserServiceMock = new Mock<IUserService>();
        LoggerMock = new Mock<ILogger<GuiaOrlaPE.API.Controller.AuthController>>();

        AuthController = new GuiaOrlaPE.API.Controller.AuthController(
            UserServiceMock.Object,
            LoggerMock.Object);
    }

    public void ResetMocks()
    {
        UserServiceMock.Reset();
        LoggerMock.Reset();
    }

    public static LoginRequest CreateValidLoginRequest()
    {
        return new LoginRequest
        {
            Email = "joao@example.com",
            Password = "SenhaSegura@123"
        };
    }

    public static LoginResponse CreateValidLoginResponse()
    {
        var userId = Guid.NewGuid();
        return new LoginResponse
        {
            AccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = new UserResponse
            {
                Id = userId,
                Name = "João Silva",
                Email = "joao@example.com",
                Profile = "Businessperson"
            }
        };
    }

    public static ForgotPasswordRequest CreateValidForgotPasswordRequest()
    {
        return new ForgotPasswordRequest
        {
            Email = "joao@example.com"
        };
    }
}
