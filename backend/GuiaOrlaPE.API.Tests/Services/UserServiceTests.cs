namespace GuiaOrlaPE.API.Tests.Services;

public class UserServiceTests : IClassFixture<UserServiceFixture>
{
    private readonly UserServiceFixture _fixture;

    public UserServiceTests(UserServiceFixture fixture)
    {
        _fixture = fixture;
        _fixture.ResetMocks();
    }

    #region CreateBusinesspersonAsync Tests

    [Fact]
    public async Task CreateBusinesspersonAsync_WithValidRequest_ShouldCreateUserSuccessfully()
    {
        // Arrange
        var request = UserServiceFixture.CreateValidRequest();
        _fixture.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _fixture.UserRepositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.UserService.CreateBusinesspersonAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(request.Name);
        result.Email.Should().Be(request.Email);
        result.Phone.Should().Be(request.Phone);
        result.Profile.Should().Be(UserProfileEnum.Businessperson);
        result.Status.Should().BeTrue();
        result.Businesses.Should().HaveCount(1);
        result.Businesses.First().Name.Should().Be(request.Business.Name);

        _fixture.UserRepositoryMock.Verify(
            r => r.GetByEmailAsync(request.Email),
            Times.Once);

        _fixture.UserRepositoryMock.Verify(
            r => r.CreateAsync(It.IsAny<User>()),
            Times.Once);
    }

    [Fact]
    public async Task CreateBusinesspersonAsync_WithExistingEmail_ShouldThrowException()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = UserServiceFixture.CreateValidRequest();
        var existingUser = UserServiceFixture.CreateValidUser();

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync(existingUser);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<Exception>(
            () => _fixture.UserService.CreateBusinesspersonAsync(request));

        ex.Message.Should().Contain("Email já cadastrado");

        _fixture.UserRepositoryMock.Verify(
            r => r.GetByEmailAsync(request.Email),
            Times.Once);

        _fixture.UserRepositoryMock.Verify(
            r => r.CreateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task CreateBusinesspersonAsync_ShouldHashPasswordCorrectly()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = UserServiceFixture.CreateValidRequest();
        var password = request.Password;

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _fixture.UserRepositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.UserService.CreateBusinesspersonAsync(request);

        // Assert
        result.PasswordHash.Should().NotBe(password);
        result.PasswordHash.Should().NotBeNullOrEmpty();
        // BCrypt hash starts with $2a$ or $2b$ or $2x$ or $2y$
        result.PasswordHash.Should().StartWith("$2");
    }

    [Fact]
    public async Task CreateBusinesspersonAsync_ShouldSetCreatedAtToUtcNow()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = UserServiceFixture.CreateValidRequest();
        var beforeCreation = DateTime.UtcNow;

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _fixture.UserRepositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.UserService.CreateBusinesspersonAsync(request);
        var afterCreation = DateTime.UtcNow;

        // Assert
        result.CreatedAt.Should().BeOnOrAfter(beforeCreation);
        result.CreatedAt.Should().BeOnOrBefore(afterCreation);
    }

    #endregion

    #region GetAllAsync Tests

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllUsers()
    {
        // Arrange
        _fixture.ResetMocks();
        var users = new List<User>
        {
            UserServiceFixture.CreateValidUser(),
            UserServiceFixture.CreateValidUser(),
            UserServiceFixture.CreateValidUser()
        };

        _fixture.UserRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(users);

        // Act
        var result = await _fixture.UserService.GetAllAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        result.Should().BeEquivalentTo(users);

        _fixture.UserRepositoryMock.Verify(
            r => r.GetAllAsync(),
            Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoUsers_ShouldReturnEmptyList()
    {
        // Arrange
        _fixture.ResetMocks();
        _fixture.UserRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<User>());

        // Act
        var result = await _fixture.UserService.GetAllAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    #endregion

    #region GetByIdAsync Tests

    [Fact]
    public async Task GetByIdAsync_WithValidId_ShouldReturnUser()
    {
        // Arrange
        _fixture.ResetMocks();
        var user = UserServiceFixture.CreateValidUser();
        var userId = user.Id;

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        // Act
        var result = await _fixture.UserService.GetByIdAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(user);

        _fixture.UserRepositoryMock.Verify(
            r => r.GetByIdAsync(userId),
            Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        _fixture.ResetMocks();
        var invalidId = Guid.NewGuid();

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByIdAsync(invalidId))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _fixture.UserService.GetByIdAsync(invalidId);

        // Assert
        result.Should().BeNull();

        _fixture.UserRepositoryMock.Verify(
            r => r.GetByIdAsync(invalidId),
            Times.Once);
    }

    #endregion

    #region UpdateAsync Tests

    [Fact]
    public async Task UpdateAsync_WithValidId_ShouldUpdateUserSuccessfully()
    {
        // Arrange
        _fixture.ResetMocks();
        var user = UserServiceFixture.CreateValidUser();
        var userId = user.Id;
        var request = UserServiceFixture.CreateValidRequest();
        request.Name = "Novo Nome";
        request.Phone = "85999999999";

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _fixture.UserRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        await _fixture.UserService.UpdateAsync(userId, request);

        // Assert
        user.Name.Should().Be(request.Name);
        user.Phone.Should().Be(request.Phone);

        _fixture.UserRepositoryMock.Verify(
            r => r.GetByIdAsync(userId),
            Times.Once);

        _fixture.UserRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<User>()),
            Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WithInvalidId_ShouldThrowException()
    {
        // Arrange
        _fixture.ResetMocks();
        var invalidId = Guid.NewGuid();
        var request = UserServiceFixture.CreateValidRequest();

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByIdAsync(invalidId))
            .ReturnsAsync((User?)null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<Exception>(
            () => _fixture.UserService.UpdateAsync(invalidId, request));

        ex.Message.Should().Contain("Usuário não encontrado");

        _fixture.UserRepositoryMock.Verify(
            r => r.GetByIdAsync(invalidId),
            Times.Once);

        _fixture.UserRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_ShouldNotUpdateEmail()
    {
        // Arrange
        _fixture.ResetMocks();
        var user = UserServiceFixture.CreateValidUser();
        var originalEmail = user.Email;
        var userId = user.Id;
        var request = UserServiceFixture.CreateValidRequest();
        request.Email = "novoemail@example.com";

        _fixture.UserRepositoryMock
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        _fixture.UserRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        await _fixture.UserService.UpdateAsync(userId, request);

        // Assert
        user.Email.Should().Be(originalEmail);
        user.Email.Should().NotBe(request.Email);
    }

    #endregion
}
