namespace GuiaOrlaPE.API.Tests.Controllers;

public class UserControllerTests : IClassFixture<UserControllerFixture>
{
    private readonly UserControllerFixture _fixture;

    public UserControllerTests(UserControllerFixture fixture)
    {
        _fixture = fixture;
        _fixture.ResetMocks();
    }

    #region CreateBusinessperson Endpoint Tests

    [Fact]
    public async Task CreateBusinessperson_WithValidRequest_ShouldReturnCreatedAtAction()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = UserControllerFixture.CreateValidRequest();
        var user = UserControllerFixture.CreateValidUser();

        _fixture.UserServiceMock
            .Setup(s => s.CreateBusinesspersonAsync(It.IsAny<CreateBusinesspersonRequest>()))
            .ReturnsAsync(user);

        // Act
        var result = await _fixture.UserController.CreateBusinessperson(request);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        createdResult.StatusCode.Should().Be(StatusCodes.Status201Created);
        createdResult.ActionName.Should().Be(nameof(_fixture.UserController.GetById));
        createdResult.RouteValues.Should().ContainKey("id");
        ((User)createdResult.Value!).Id.Should().Be(user.Id);

        _fixture.UserServiceMock.Verify(
            s => s.CreateBusinesspersonAsync(It.IsAny<CreateBusinesspersonRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task CreateBusinessperson_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = UserControllerFixture.CreateValidRequest();

        _fixture.UserServiceMock
            .Setup(s => s.CreateBusinesspersonAsync(It.IsAny<CreateBusinesspersonRequest>()))
            .ThrowsAsync(new Exception("Email já cadastrado."));

        // Act
        var result = await _fixture.UserController.CreateBusinessperson(request);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);

        _fixture.UserServiceMock.Verify(
            s => s.CreateBusinesspersonAsync(It.IsAny<CreateBusinesspersonRequest>()),
            Times.Once);
    }

    #endregion

    #region GetAll Endpoint Tests

    [Fact]
    public async Task GetAll_ShouldReturnOkWithUsersList()
    {
        // Arrange
        _fixture.ResetMocks();
        var users = new List<User>
        {
            UserControllerFixture.CreateValidUser(),
            UserControllerFixture.CreateValidUser(),
            UserControllerFixture.CreateValidUser()
        };

        _fixture.UserServiceMock
            .Setup(s => s.GetAllAsync())
            .ReturnsAsync(users);

        // Act
        var result = await _fixture.UserController.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedUsers = Assert.IsType<List<User>>(okResult.Value);
        returnedUsers.Should().HaveCount(3);
        returnedUsers.Should().BeEquivalentTo(users);

        _fixture.UserServiceMock.Verify(
            s => s.GetAllAsync(),
            Times.Once);
    }

    [Fact]
    public async Task GetAll_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        _fixture.UserServiceMock
            .Setup(s => s.GetAllAsync())
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.UserController.GetAll();

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    [Fact]
    public async Task GetAll_WhenNoUsers_ShouldReturnOkWithEmptyList()
    {
        // Arrange
        _fixture.ResetMocks();
        _fixture.UserServiceMock
            .Setup(s => s.GetAllAsync())
            .ReturnsAsync(new List<User>());

        // Act
        var result = await _fixture.UserController.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedUsers = Assert.IsType<List<User>>(okResult.Value);
        returnedUsers.Should().BeEmpty();
    }

    #endregion

    #region GetById Endpoint Tests

    [Fact]
    public async Task GetById_WithValidId_ShouldReturnOkWithUser()
    {
        // Arrange
        _fixture.ResetMocks();
        var user = UserControllerFixture.CreateValidUser();
        var userId = user.Id;

        _fixture.UserServiceMock
            .Setup(s => s.GetByIdAsync(userId))
            .ReturnsAsync(user);

        // Act
        var result = await _fixture.UserController.GetById(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedUser = Assert.IsType<User>(okResult.Value);
        returnedUser.Should().BeEquivalentTo(user);

        _fixture.UserServiceMock.Verify(
            s => s.GetByIdAsync(userId),
            Times.Once);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        _fixture.ResetMocks();
        var invalidId = Guid.NewGuid();

        _fixture.UserServiceMock
            .Setup(s => s.GetByIdAsync(invalidId))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _fixture.UserController.GetById(invalidId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        notFoundResult.StatusCode.Should().Be(StatusCodes.Status404NotFound);

        _fixture.UserServiceMock.Verify(
            s => s.GetByIdAsync(invalidId),
            Times.Once);
    }

    [Fact]
    public async Task GetById_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();

        _fixture.UserServiceMock
            .Setup(s => s.GetByIdAsync(userId))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.UserController.GetById(userId);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    #endregion

    #region Update Endpoint Tests

    [Fact]
    public async Task Update_WithValidIdAndRequest_ShouldReturnNoContent()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var request = UserControllerFixture.CreateValidRequest();

        _fixture.UserServiceMock
            .Setup(s => s.UpdateAsync(userId, It.IsAny<CreateBusinesspersonRequest>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.UserController.Update(userId, request);

        // Assert
        var noContentResult = Assert.IsType<NoContentResult>(result);
        noContentResult.StatusCode.Should().Be(StatusCodes.Status204NoContent);

        _fixture.UserServiceMock.Verify(
            s => s.UpdateAsync(userId, It.IsAny<CreateBusinesspersonRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task Update_WhenUserNotFound_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var request = UserControllerFixture.CreateValidRequest();

        _fixture.UserServiceMock
            .Setup(s => s.UpdateAsync(userId, It.IsAny<CreateBusinesspersonRequest>()))
            .ThrowsAsync(new Exception("Usuário não encontrado."));

        // Act
        var result = await _fixture.UserController.Update(userId, request);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);

        _fixture.UserServiceMock.Verify(
            s => s.UpdateAsync(userId, It.IsAny<CreateBusinesspersonRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task Update_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var request = UserControllerFixture.CreateValidRequest();

        _fixture.UserServiceMock
            .Setup(s => s.UpdateAsync(userId, It.IsAny<CreateBusinesspersonRequest>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.UserController.Update(userId, request);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    #endregion

    #region GetBusinessesByUser Endpoint Tests

    [Fact]
    public async Task GetBusinessesByUser_WithValidUserId_ShouldReturnOkWithPaginatedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var paginationRequest = new PaginationRequest { Page = 1, PageSize = 10 };
        var businesses = new List<BusinessResponse>
        {
            new BusinessResponse { Id = Guid.NewGuid(), Name = "Business 1" },
            new BusinessResponse { Id = Guid.NewGuid(), Name = "Business 2" }
        };
        var pagedResponse = new PagedResponse<BusinessResponse>
        {
            Items = businesses,
            Page = 1,
            PageSize = 10,
            TotalItems = 2,
            TotalPages = 1,
            HasNextPage = false,
            HasPreviousPage = false
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.GetByUserIdAsync(userId, It.IsAny<PaginationRequest>()))
            .ReturnsAsync(pagedResponse);

        // Act
        var result = await _fixture.UserController.GetBusinessesByUser(userId, paginationRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedResponse = Assert.IsType<PagedResponse<BusinessResponse>>(okResult.Value);
        returnedResponse.Items.Should().HaveCount(2);
        returnedResponse.TotalItems.Should().Be(2);

        _fixture.BusinessServiceMock.Verify(
            s => s.GetByUserIdAsync(userId, It.IsAny<PaginationRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task GetBusinessesByUser_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var paginationRequest = new PaginationRequest { Page = 1, PageSize = 10 };

        _fixture.BusinessServiceMock
            .Setup(s => s.GetByUserIdAsync(userId, It.IsAny<PaginationRequest>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.UserController.GetBusinessesByUser(userId, paginationRequest);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    [Fact]
    public async Task GetBusinessesByUser_WhenNoBusinesses_ShouldReturnOkWithEmptyPaginatedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var paginationRequest = new PaginationRequest { Page = 1, PageSize = 10 };
        var emptyResponse = new PagedResponse<BusinessResponse>
        {
            Items = [],
            Page = 1,
            PageSize = 10,
            TotalItems = 0,
            TotalPages = 0,
            HasNextPage = false,
            HasPreviousPage = false
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.GetByUserIdAsync(userId, It.IsAny<PaginationRequest>()))
            .ReturnsAsync(emptyResponse);

        // Act
        var result = await _fixture.UserController.GetBusinessesByUser(userId, paginationRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedResponse = Assert.IsType<PagedResponse<BusinessResponse>>(okResult.Value);
        returnedResponse.Items.Should().BeEmpty();
        returnedResponse.TotalItems.Should().Be(0);
    }

    #endregion
}
