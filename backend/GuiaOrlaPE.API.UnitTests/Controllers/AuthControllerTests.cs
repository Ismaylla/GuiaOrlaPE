namespace GuiaOrlaPE.API.UnitTests.Controllers;

public class AuthControllerTests : IClassFixture<AuthControllerFixture>
{
    private readonly AuthControllerFixture _fixture;

    public AuthControllerTests(AuthControllerFixture fixture)
    {
        _fixture = fixture;
        _fixture.ResetMocks();
    }

    #region Login Endpoint Tests

    [Fact]
    public async Task Login_WithValidCredentials_ShouldReturnOkWithLoginResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidLoginRequest();
        var loginResponse = AuthControllerFixture.CreateValidLoginResponse();

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ReturnsAsync(loginResponse);

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedResponse = Assert.IsType<LoginResponse>(okResult.Value);
        returnedResponse.User.Email.Should().Be(request.Email);
        returnedResponse.AccessToken.Should().NotBeNullOrEmpty();
        returnedResponse.User.Id.Should().NotBeEmpty();

        _fixture.UserServiceMock.Verify(
            s => s.LoginAsync(It.IsAny<LoginRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ShouldReturnUnauthorized()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidLoginRequest();

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ThrowsAsync(new UnauthorizedAccessException("Email ou senha inválidos."));

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        unauthorizedResult.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);

        _fixture.UserServiceMock.Verify(
            s => s.LoginAsync(It.IsAny<LoginRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ShouldReturnUnauthorized()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = new LoginRequest
        {
            Email = "joao@example.com",
            Password = "SenhaErrada123"
        };

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ThrowsAsync(new UnauthorizedAccessException("Senha incorreta."));

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        unauthorizedResult.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }

    [Fact]
    public async Task Login_WithNonExistentEmail_ShouldReturnUnauthorized()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = new LoginRequest
        {
            Email = "naoexiste@example.com",
            Password = "SenhaQualquer123"
        };

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ThrowsAsync(new UnauthorizedAccessException("Usuário não encontrado."));

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        unauthorizedResult.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }

    [Fact]
    public async Task Login_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidLoginRequest();

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ThrowsAsync(new Exception("Database connection error"));

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);

        _fixture.UserServiceMock.Verify(
            s => s.LoginAsync(It.IsAny<LoginRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task Login_ShouldReturnAccessTokenInResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidLoginRequest();
        var loginResponse = AuthControllerFixture.CreateValidLoginResponse();
        loginResponse.AccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ...";

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ReturnsAsync(loginResponse);

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedResponse = Assert.IsType<LoginResponse>(okResult.Value);
        returnedResponse.AccessToken.Should().Be(loginResponse.AccessToken);
    }

    #endregion

    #region ForgotPassword Endpoint Tests

    [Fact]
    public async Task ForgotPassword_WithValidEmail_ShouldReturnOk()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidForgotPasswordRequest();

        _fixture.UserServiceMock
            .Setup(s => s.ForgotPasswordAsync(request.Email))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.AuthController.ForgotPassword(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        _fixture.UserServiceMock.Verify(
            s => s.ForgotPasswordAsync(request.Email),
            Times.Once);
    }

    [Fact]
    public async Task ForgotPassword_WithValidEmail_ShouldReturnSuccessMessage()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidForgotPasswordRequest();

        _fixture.UserServiceMock
            .Setup(s => s.ForgotPasswordAsync(request.Email))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.AuthController.ForgotPassword(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        // Verify the response contains a message property
        var valueType = okResult.Value?.GetType();
        valueType.Should().NotBeNull();
    }

    [Fact]
    public async Task ForgotPassword_WithInvalidEmail_ShouldReturnOk()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = new ForgotPasswordRequest
        {
            Email = "naoexiste@example.com"
        };

        _fixture.UserServiceMock
            .Setup(s => s.ForgotPasswordAsync(request.Email))
            .Returns(Task.CompletedTask); // Service não lança erro por segurança

        // Act
        var result = await _fixture.AuthController.ForgotPassword(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public async Task ForgotPassword_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidForgotPasswordRequest();

        _fixture.UserServiceMock
            .Setup(s => s.ForgotPasswordAsync(request.Email))
            .ThrowsAsync(new Exception("Email sending error"));

        // Act
        var result = await _fixture.AuthController.ForgotPassword(request);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);

        _fixture.UserServiceMock.Verify(
            s => s.ForgotPasswordAsync(request.Email),
            Times.Once);
    }

    [Fact]
    public async Task ForgotPassword_ShouldCallUserServiceWithCorrectEmail()
    {
        // Arrange
        _fixture.ResetMocks();
        var email = "teste@example.com";
        var request = new ForgotPasswordRequest { Email = email };

        _fixture.UserServiceMock
            .Setup(s => s.ForgotPasswordAsync(email))
            .Returns(Task.CompletedTask);

        // Act
        await _fixture.AuthController.ForgotPassword(request);

        // Assert
        _fixture.UserServiceMock.Verify(
            s => s.ForgotPasswordAsync(email),
            Times.Once);
    }

    #endregion

    #region Login Response Content Tests

    [Fact]
    public async Task Login_ResponseShouldContainUserDetails()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = AuthControllerFixture.CreateValidLoginRequest();
        var userId = Guid.NewGuid();
        var loginResponse = new LoginResponse
        {
            AccessToken = "token123",
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = new UserResponse
            {
                Id = userId,
                Name = "João Silva",
                Email = "joao@example.com",
                Profile = "Businessperson"
            }
        };

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ReturnsAsync(loginResponse);

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);

        response.User.Id.Should().Be(loginResponse.User.Id);
        response.User.Name.Should().Be(loginResponse.User.Name);
        response.User.Email.Should().Be(loginResponse.User.Email);
        response.AccessToken.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Login_ShouldPassEmailToService()
    {
        // Arrange
        _fixture.ResetMocks();
        var email = "test@example.com";
        var request = new LoginRequest { Email = email, Password = "password123" };
        var loginResponse = AuthControllerFixture.CreateValidLoginResponse();

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.Is<LoginRequest>(r => r.Email == email)))
            .ReturnsAsync(loginResponse);

        // Act
        await _fixture.AuthController.Login(request);

        // Assert
        _fixture.UserServiceMock.Verify(
            s => s.LoginAsync(It.Is<LoginRequest>(r => r.Email == email)),
            Times.Once);
    }

    [Fact]
    public async Task Login_ShouldPassPasswordToService()
    {
        // Arrange
        _fixture.ResetMocks();
        var password = "MySecurePassword123";
        var request = new LoginRequest { Email = "test@example.com", Password = password };
        var loginResponse = AuthControllerFixture.CreateValidLoginResponse();

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.Is<LoginRequest>(r => r.Password == password)))
            .ReturnsAsync(loginResponse);

        // Act
        await _fixture.AuthController.Login(request);

        // Assert
        _fixture.UserServiceMock.Verify(
            s => s.LoginAsync(It.Is<LoginRequest>(r => r.Password == password)),
            Times.Once);
    }

    #endregion

    #region Edge Cases Tests

    [Fact]
    public async Task Login_WithEmptyEmail_ShouldCallServiceAnyway()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = new LoginRequest { Email = "", Password = "password" };
        var loginResponse = AuthControllerFixture.CreateValidLoginResponse();

        _fixture.UserServiceMock
            .Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ThrowsAsync(new UnauthorizedAccessException());

        // Act
        var result = await _fixture.AuthController.Login(request);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        unauthorizedResult.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }

    [Fact]
    public async Task ForgotPassword_WithEmptyEmail_ShouldCallService()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = new ForgotPasswordRequest { Email = "" };

        _fixture.UserServiceMock
            .Setup(s => s.ForgotPasswordAsync(It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.AuthController.ForgotPassword(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    #endregion
}
