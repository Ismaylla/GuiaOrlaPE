namespace GuiaOrlaPE.API.Tests.Controllers;

public class BusinessControllerTests : IClassFixture<BusinessControllerFixture>
{
    private readonly BusinessControllerFixture _fixture;

    public BusinessControllerTests(BusinessControllerFixture fixture)
    {
        _fixture = fixture;
        _fixture.ResetMocks();
    }

    #region GetAll Endpoint Tests

    [Fact]
    public async Task GetAll_ShouldReturnOkWithBusinessesList()
    {
        // Arrange
        _fixture.ResetMocks();
        var businesses = new List<BusinessResponse>
        {
            BusinessControllerFixture.CreateValidBusinessResponse(),
            BusinessControllerFixture.CreateValidBusinessResponse(),
            BusinessControllerFixture.CreateValidBusinessResponse()
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.GetAllAsync())
            .ReturnsAsync(businesses);

        // Act
        var result = await _fixture.BusinessController.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedBusinesses = Assert.IsType<List<BusinessResponse>>(okResult.Value);
        returnedBusinesses.Should().HaveCount(3);
        returnedBusinesses.Should().BeEquivalentTo(businesses);

        _fixture.BusinessServiceMock.Verify(
            s => s.GetAllAsync(),
            Times.Once);
    }

    [Fact]
    public async Task GetAll_WhenNoBusinesses_ShouldReturnOkWithEmptyList()
    {
        // Arrange
        _fixture.ResetMocks();
        _fixture.BusinessServiceMock
            .Setup(s => s.GetAllAsync())
            .ReturnsAsync(new List<BusinessResponse>());

        // Act
        var result = await _fixture.BusinessController.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedBusinesses = Assert.IsType<List<BusinessResponse>>(okResult.Value);
        returnedBusinesses.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAll_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        _fixture.BusinessServiceMock
            .Setup(s => s.GetAllAsync())
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.BusinessController.GetAll();

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    #endregion

    #region GetById Endpoint Tests

    [Fact]
    public async Task GetById_WithValidId_ShouldReturnOkWithBusiness()
    {
        // Arrange
        _fixture.ResetMocks();
        var business = BusinessControllerFixture.CreateValidBusinessResponse();
        var businessId = business.Id;

        _fixture.BusinessServiceMock
            .Setup(s => s.GetByIdAsync(businessId))
            .ReturnsAsync(business);

        // Act
        var result = await _fixture.BusinessController.GetById(businessId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedBusiness = Assert.IsType<BusinessResponse>(okResult.Value);
        returnedBusiness.Should().BeEquivalentTo(business);

        _fixture.BusinessServiceMock.Verify(
            s => s.GetByIdAsync(businessId),
            Times.Once);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        _fixture.ResetMocks();
        var invalidId = Guid.NewGuid();

        _fixture.BusinessServiceMock
            .Setup(s => s.GetByIdAsync(invalidId))
            .ReturnsAsync((BusinessResponse?)null);

        // Act
        var result = await _fixture.BusinessController.GetById(invalidId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        notFoundResult.StatusCode.Should().Be(StatusCodes.Status404NotFound);

        _fixture.BusinessServiceMock.Verify(
            s => s.GetByIdAsync(invalidId),
            Times.Once);
    }

    [Fact]
    public async Task GetById_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();

        _fixture.BusinessServiceMock
            .Setup(s => s.GetByIdAsync(businessId))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.BusinessController.GetById(businessId);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    #endregion

    #region Search Endpoint Tests

    [Fact]
    public async Task Search_WithValidRequest_ShouldReturnOkWithPagedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var searchRequest = BusinessControllerFixture.CreateSearchRequest();
        var businesses = new List<BusinessResponse>
        {
            BusinessControllerFixture.CreateValidBusinessResponse(),
            BusinessControllerFixture.CreateValidBusinessResponse()
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
            .Setup(s => s.SearchAsync(It.IsAny<SearchBusinessRequest>()))
            .ReturnsAsync(pagedResponse);

        // Act
        var result = await _fixture.BusinessController.Search(searchRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        okResult.StatusCode.Should().Be(StatusCodes.Status200OK);

        var returnedResponse = Assert.IsType<PagedResponse<BusinessResponse>>(okResult.Value);
        returnedResponse.Items.Should().HaveCount(2);
        returnedResponse.TotalItems.Should().Be(2);

        _fixture.BusinessServiceMock.Verify(
            s => s.SearchAsync(It.IsAny<SearchBusinessRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task Search_WhenNoResults_ShouldReturnOkWithEmptyPagedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var searchRequest = BusinessControllerFixture.CreateSearchRequest();
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
            .Setup(s => s.SearchAsync(It.IsAny<SearchBusinessRequest>()))
            .ReturnsAsync(emptyResponse);

        // Act
        var result = await _fixture.BusinessController.Search(searchRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedResponse = Assert.IsType<PagedResponse<BusinessResponse>>(okResult.Value);
        returnedResponse.Items.Should().BeEmpty();
        returnedResponse.TotalItems.Should().Be(0);
    }

    [Fact]
    public async Task Search_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var searchRequest = BusinessControllerFixture.CreateSearchRequest();

        _fixture.BusinessServiceMock
            .Setup(s => s.SearchAsync(It.IsAny<SearchBusinessRequest>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.BusinessController.Search(searchRequest);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    #endregion

    #region Create Endpoint Tests

    [Fact]
    public async Task Create_WithValidRequest_ShouldReturnCreatedAtAction()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = BusinessControllerFixture.CreateValidRequest();
        var businessResponse = BusinessControllerFixture.CreateValidBusinessResponse();
        var userId = Guid.NewGuid();

        // Setup user claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.CreateAsync(It.IsAny<CreateBusinessRequest>(), userId))
            .ReturnsAsync(businessResponse);

        // Act
        var result = await _fixture.BusinessController.Create(request);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        createdResult.StatusCode.Should().Be(StatusCodes.Status201Created);
        createdResult.ActionName.Should().Be(nameof(_fixture.BusinessController.GetById));
        createdResult.RouteValues.Should().ContainKey("id");

        _fixture.BusinessServiceMock.Verify(
            s => s.CreateAsync(It.IsAny<CreateBusinessRequest>(), userId),
            Times.Once);
    }

    [Fact]
    public async Task Create_WhenUserIdClaimMissing_ShouldReturnUnauthorized()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = BusinessControllerFixture.CreateValidRequest();

        // Setup controller without user claims
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
        };

        // Act
        var result = await _fixture.BusinessController.Create(request);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedResult>(result);
        unauthorizedResult.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);

        _fixture.BusinessServiceMock.Verify(
            s => s.CreateAsync(It.IsAny<CreateBusinessRequest>(), It.IsAny<Guid>()),
            Times.Never);
    }

    [Fact]
    public async Task Create_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = BusinessControllerFixture.CreateValidRequest();
        var userId = Guid.NewGuid();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.CreateAsync(It.IsAny<CreateBusinessRequest>(), userId))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.BusinessController.Create(request);

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
        var businessId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var request = BusinessControllerFixture.CreateValidRequest();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.UpdateAsync(businessId, It.IsAny<CreateBusinessRequest>(), userId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.BusinessController.Update(businessId, request);

        // Assert
        var noContentResult = Assert.IsType<NoContentResult>(result);
        noContentResult.StatusCode.Should().Be(StatusCodes.Status204NoContent);

        _fixture.BusinessServiceMock.Verify(
            s => s.UpdateAsync(businessId, It.IsAny<CreateBusinessRequest>(), userId),
            Times.Once);
    }

    [Fact]
    public async Task Update_WhenUserIdClaimMissing_ShouldReturnUnauthorized()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();
        var request = BusinessControllerFixture.CreateValidRequest();

        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
        };

        // Act
        var result = await _fixture.BusinessController.Update(businessId, request);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedResult>(result);
        unauthorizedResult.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);

        _fixture.BusinessServiceMock.Verify(
            s => s.UpdateAsync(It.IsAny<Guid>(), It.IsAny<CreateBusinessRequest>(), It.IsAny<Guid>()),
            Times.Never);
    }

    [Fact]
    public async Task Update_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var request = BusinessControllerFixture.CreateValidRequest();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.UpdateAsync(businessId, It.IsAny<CreateBusinessRequest>(), userId))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _fixture.BusinessController.Update(businessId, request);

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        statusResult.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }

    #endregion

    #region UploadImage Endpoint Tests

    [Fact]
    public async Task UploadImage_WhenFileIsNull_ShouldReturnBadRequest()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();
        var uploadRequest = new UploadImageRequest { File = null! };

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        // Act
        var result = await _fixture.BusinessController.UploadImage(businessId, uploadRequest, "profile");

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        badRequestResult.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }

    [Fact]
    public async Task UploadImage_WhenTypeParameterIsMissing_ShouldReturnBadRequest()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.FileName).Returns("test.jpg");
        fileMock.Setup(f => f.Length).Returns(1024);

        var uploadRequest = new UploadImageRequest { File = fileMock.Object };

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        // Act
        var result = await _fixture.BusinessController.UploadImage(businessId, uploadRequest, "");

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        badRequestResult.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }

    [Fact]
    public async Task UploadImage_WhenFileFormatIsInvalid_ShouldReturnBadRequest()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.FileName).Returns("test.pdf"); // Invalid format
        fileMock.Setup(f => f.Length).Returns(1024);

        var uploadRequest = new UploadImageRequest { File = fileMock.Object };

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        // Act
        var result = await _fixture.BusinessController.UploadImage(businessId, uploadRequest, "profile");

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        badRequestResult.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }

    [Fact]
    public async Task UploadImage_WhenBusinessNotFound_ShouldReturnNotFound()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.FileName).Returns("test.jpg");
        fileMock.Setup(f => f.Length).Returns(1024);

        var uploadRequest = new UploadImageRequest { File = fileMock.Object };

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        _fixture.BusinessController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        _fixture.BusinessServiceMock
            .Setup(s => s.GetByIdAsync(businessId))
            .ReturnsAsync((BusinessResponse?)null);

        // Act
        var result = await _fixture.BusinessController.UploadImage(businessId, uploadRequest, "profile");

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        notFoundResult.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }

    #endregion
}
