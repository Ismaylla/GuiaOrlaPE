namespace GuiaOrlaPE.API.UnitTests.Services;

public class BusinessServiceTests : IClassFixture<BusinessServiceFixture>
{
    private readonly BusinessServiceFixture _fixture;

    public BusinessServiceTests(BusinessServiceFixture fixture)
    {
        _fixture = fixture;
        _fixture.ResetMocks();
    }

    #region GetAllAsync Tests

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllBusinesses()
    {
        // Arrange
        _fixture.ResetMocks();
        var businesses = new List<Business>
        {
            BusinessServiceFixture.CreateValidBusinessEntity(),
            BusinessServiceFixture.CreateValidBusinessEntity(),
            BusinessServiceFixture.CreateValidBusinessEntity()
        };

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(businesses);

        // Act
        var result = await _fixture.BusinessService.GetAllAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        result.Should().AllSatisfy(b =>
        {
            b.Id.Should().NotBeEmpty();
            b.Name.Should().NotBeNullOrEmpty();
            b.UserId.Should().NotBeEmpty();
        });

        _fixture.BusinessRepositoryMock.Verify(
            r => r.GetAllAsync(),
            Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoBusinesses_ShouldReturnEmptyList()
    {
        // Arrange
        _fixture.ResetMocks();
        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<Business>());

        // Act
        var result = await _fixture.BusinessService.GetAllAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        // Arrange
        _fixture.ResetMocks();
        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(
            () => _fixture.BusinessService.GetAllAsync());
    }

    #endregion

    #region GetByIdAsync Tests

    [Fact]
    public async Task GetByIdAsync_WithValidId_ShouldReturnBusiness()
    {
        // Arrange
        _fixture.ResetMocks();
        var business = BusinessServiceFixture.CreateValidBusinessEntity();
        var businessId = business.Id;

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(businessId))
            .ReturnsAsync(business);

        // Act
        var result = await _fixture.BusinessService.GetByIdAsync(businessId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(businessId);
        result.Name.Should().Be(business.Name);
        result.UserId.Should().Be(business.UserId);

        _fixture.BusinessRepositoryMock.Verify(
            r => r.GetByIdAsync(businessId),
            Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        _fixture.ResetMocks();
        var invalidId = Guid.NewGuid();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(invalidId))
            .ReturnsAsync((Business?)null);

        // Act
        var result = await _fixture.BusinessService.GetByIdAsync(invalidId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(businessId))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(
            () => _fixture.BusinessService.GetByIdAsync(businessId));
    }

    #endregion

    #region SearchAsync Tests

    [Fact]
    public async Task SearchAsync_WithValidRequest_ShouldReturnPagedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var searchRequest = BusinessServiceFixture.CreateSearchRequest();
        var businesses = new List<Business>
        {
            BusinessServiceFixture.CreateValidBusinessEntity(),
            BusinessServiceFixture.CreateValidBusinessEntity()
        };

        _fixture.BusinessRepositoryMock
            .Setup(r => r.SearchAsync(It.IsAny<SearchBusinessRequest>()))
            .ReturnsAsync((businesses, 2));

        // Act
        var result = await _fixture.BusinessService.SearchAsync(searchRequest);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(2);
        result.TotalItems.Should().Be(2);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
        result.TotalPages.Should().Be(1);
        result.HasNextPage.Should().BeFalse();
        result.HasPreviousPage.Should().BeFalse();

        _fixture.BusinessRepositoryMock.Verify(
            r => r.SearchAsync(It.IsAny<SearchBusinessRequest>()),
            Times.Once);
    }

    [Fact]
    public async Task SearchAsync_WhenNoResults_ShouldReturnEmptyPagedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var searchRequest = BusinessServiceFixture.CreateSearchRequest();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.SearchAsync(It.IsAny<SearchBusinessRequest>()))
            .ReturnsAsync((new List<Business>(), 0));

        // Act
        var result = await _fixture.BusinessService.SearchAsync(searchRequest);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().BeEmpty();
        result.TotalItems.Should().Be(0);
        result.TotalPages.Should().Be(0);
    }

    [Fact]
    public async Task SearchAsync_WithMultiplePages_ShouldCalculatePaginationCorrectly()
    {
        // Arrange
        _fixture.ResetMocks();
        var searchRequest = new SearchBusinessRequest { Page = 2, PageSize = 10 };
        var businesses = new List<Business>
        {
            BusinessServiceFixture.CreateValidBusinessEntity(),
            BusinessServiceFixture.CreateValidBusinessEntity()
        };

        _fixture.BusinessRepositoryMock
            .Setup(r => r.SearchAsync(It.IsAny<SearchBusinessRequest>()))
            .ReturnsAsync((businesses, 25)); // 25 total items

        // Act
        var result = await _fixture.BusinessService.SearchAsync(searchRequest);

        // Assert
        result.TotalPages.Should().Be(3); // 25 / 10 = 2.5 rounded up to 3
        result.HasNextPage.Should().BeTrue(); // Page 2 of 3
        result.HasPreviousPage.Should().BeTrue(); // Page 2
    }

    [Fact]
    public async Task SearchAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        // Arrange
        _fixture.ResetMocks();
        var searchRequest = BusinessServiceFixture.CreateSearchRequest();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.SearchAsync(It.IsAny<SearchBusinessRequest>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(
            () => _fixture.BusinessService.SearchAsync(searchRequest));
    }

    #endregion

    #region GetByUserIdAsync Tests

    [Fact]
    public async Task GetByUserIdAsync_WithValidUserId_ShouldReturnPagedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var paginationRequest = new PaginationRequest { Page = 1, PageSize = 10 };
        var businesses = new List<Business>
        {
            BusinessServiceFixture.CreateValidBusinessEntity(),
            BusinessServiceFixture.CreateValidBusinessEntity()
        };

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByUserIdAsync(userId, paginationRequest.Page, paginationRequest.PageSize))
            .ReturnsAsync((businesses, 2));

        // Act
        var result = await _fixture.BusinessService.GetByUserIdAsync(userId, paginationRequest);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(2);
        result.TotalItems.Should().Be(2);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);

        _fixture.BusinessRepositoryMock.Verify(
            r => r.GetByUserIdAsync(userId, paginationRequest.Page, paginationRequest.PageSize),
            Times.Once);
    }

    [Fact]
    public async Task GetByUserIdAsync_WhenUserHasNoBusinesses_ShouldReturnEmptyPagedResponse()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var paginationRequest = new PaginationRequest { Page = 1, PageSize = 10 };

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByUserIdAsync(userId, paginationRequest.Page, paginationRequest.PageSize))
            .ReturnsAsync((new List<Business>(), 0));

        // Act
        var result = await _fixture.BusinessService.GetByUserIdAsync(userId, paginationRequest);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().BeEmpty();
        result.TotalItems.Should().Be(0);
    }

    [Fact]
    public async Task GetByUserIdAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        // Arrange
        _fixture.ResetMocks();
        var userId = Guid.NewGuid();
        var paginationRequest = new PaginationRequest { Page = 1, PageSize = 10 };

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByUserIdAsync(userId, paginationRequest.Page, paginationRequest.PageSize))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(
            () => _fixture.BusinessService.GetByUserIdAsync(userId, paginationRequest));
    }

    #endregion

    #region CreateAsync Tests

    [Fact]
    public async Task CreateAsync_WithValidRequest_ShouldCreateBusinessSuccessfully()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = BusinessServiceFixture.CreateValidRequest();
        var userId = Guid.NewGuid();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Business>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.BusinessService.CreateAsync(request, userId);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().NotBeEmpty();
        result.UserId.Should().Be(userId);
        result.Name.Should().Be(request.Name);
        result.Address.Should().Be(request.Address);
        result.ServiceType.Should().Be(request.ServiceType);
        result.Latitude.Should().Be(request.Latitude);
        result.Longitude.Should().Be(request.Longitude);

        _fixture.BusinessRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Business>()),
            Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldSetStatusToTrue()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = BusinessServiceFixture.CreateValidRequest();
        var userId = Guid.NewGuid();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Business>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _fixture.BusinessService.CreateAsync(request, userId);

        // Assert
        // The service creates a business with Status = true
        _fixture.BusinessRepositoryMock.Verify(
            r => r.AddAsync(It.Is<Business>(b => b.Status == true)),
            Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        // Arrange
        _fixture.ResetMocks();
        var request = BusinessServiceFixture.CreateValidRequest();
        var userId = Guid.NewGuid();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Business>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(
            () => _fixture.BusinessService.CreateAsync(request, userId));
    }

    #endregion

    #region UpdateAsync Tests

    [Fact]
    public async Task UpdateAsync_WithValidIdAndRequest_ShouldUpdateBusinessSuccessfully()
    {
        // Arrange
        _fixture.ResetMocks();
        var business = BusinessServiceFixture.CreateValidBusinessEntity();
        var businessId = business.Id;
        var userId = business.UserId;
        var request = BusinessServiceFixture.CreateValidRequest();
        request.Name = "Novo Nome";
        request.Address = "Novo Endereço";

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(businessId))
            .ReturnsAsync(business);

        _fixture.BusinessRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<Business>()))
            .Returns(Task.CompletedTask);

        // Act
        await _fixture.BusinessService.UpdateAsync(businessId, request, userId);

        // Assert
        business.Name.Should().Be(request.Name);
        business.Address.Should().Be(request.Address);

        _fixture.BusinessRepositoryMock.Verify(
            r => r.GetByIdAsync(businessId),
            Times.Once);

        _fixture.BusinessRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<Business>()),
            Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WithInvalidId_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        _fixture.ResetMocks();
        var invalidId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var request = BusinessServiceFixture.CreateValidRequest();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(invalidId))
            .ReturnsAsync((Business?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _fixture.BusinessService.UpdateAsync(invalidId, request, userId));

        _fixture.BusinessRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<Business>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateAllProperties()
    {
        // Arrange
        _fixture.ResetMocks();
        var business = BusinessServiceFixture.CreateValidBusinessEntity();
        var businessId = business.Id;
        var userId = business.UserId;
        var request = new CreateBusinessRequest
        {
            Name = "Nome Atualizado",
            ServiceType = BusinessServiceTypeEnum.PasseiosELazer,
            Address = "Endereço Atualizado",
            Latitude = -3.1200,
            Longitude = -60.0250,
            Horario = "09:00 - 23:00",
            Cartao = false,
            Pix = true,
            Dinheiro = true,
            Chuveiro = true,
            Estacionamento = false,
            Cadeira = true,
            PetFriendly = false,
            Acessibilidade = true,
            Wifi = false,
            Description = "Descrição atualizada",
            BusinessPhotoUrl = "https://new.com/photo.jpg",
            CoverPhotoUrl = "https://new.com/cover.jpg",
            CardImageUrl = "https://new.com/card.jpg",
            GalleryPhotos = []
        };

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(businessId))
            .ReturnsAsync(business);

        _fixture.BusinessRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<Business>()))
            .Returns(Task.CompletedTask);

        // Act
        await _fixture.BusinessService.UpdateAsync(businessId, request, userId);

        // Assert
        business.Name.Should().Be(request.Name);
        business.ServiceType.Should().Be(request.ServiceType);
        business.Address.Should().Be(request.Address);
        business.Latitude.Should().Be(request.Latitude);
        business.Longitude.Should().Be(request.Longitude);
        business.Horario.Should().Be(request.Horario);
        business.Cartao.Should().Be(request.Cartao);
        business.Pix.Should().Be(request.Pix);
        business.Description.Should().Be(request.Description);
    }

    [Fact]
    public async Task UpdateAsync_WithNullGalleryPhotos_ShouldNotUpdatePhotos()
    {
        // Arrange
        _fixture.ResetMocks();
        var business = BusinessServiceFixture.CreateValidBusinessEntity();
        var businessId = business.Id;
        var userId = business.UserId;
        var originalPhotos = business.Photos;
        var request = BusinessServiceFixture.CreateValidRequest();
        request.GalleryPhotos = null!;

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(businessId))
            .ReturnsAsync(business);

        _fixture.BusinessRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<Business>()))
            .Returns(Task.CompletedTask);

        // Act
        await _fixture.BusinessService.UpdateAsync(businessId, request, userId);

        // Assert
        business.Photos.Should().BeSameAs(originalPhotos);
    }

    [Fact]
    public async Task UpdateAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        // Arrange
        _fixture.ResetMocks();
        var businessId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var request = BusinessServiceFixture.CreateValidRequest();

        _fixture.BusinessRepositoryMock
            .Setup(r => r.GetByIdAsync(businessId))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(
            () => _fixture.BusinessService.UpdateAsync(businessId, request, userId));
    }

    #endregion
}
