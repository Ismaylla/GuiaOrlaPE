namespace GuiaOrlaPE.API.Tests.Fixtures;

public class BusinessServiceFixture
{
    public Mock<IBusinessRepository> BusinessRepositoryMock { get; set; }
    public Mock<ILogger<GuiaOrlaPE.API.Service.Implementation.BusinessService>> LoggerMock { get; set; }
    public GuiaOrlaPE.API.Service.Implementation.BusinessService BusinessService { get; set; }

    public BusinessServiceFixture()
    {
        BusinessRepositoryMock = new Mock<IBusinessRepository>();
        LoggerMock = new Mock<ILogger<GuiaOrlaPE.API.Service.Implementation.BusinessService>>();
        BusinessService = new GuiaOrlaPE.API.Service.Implementation.BusinessService(
            BusinessRepositoryMock.Object,
            LoggerMock.Object);
    }

    public void ResetMocks()
    {
        BusinessRepositoryMock.Reset();
        LoggerMock.Reset();
    }

    public static CreateBusinessRequest CreateValidRequest()
    {
        return new CreateBusinessRequest
        {
            Name = "Restaurante João",
            ServiceType = BusinessServiceTypeEnum.BaresERestaurantes,
            Address = "Rua das Flores, 123",
            Latitude = -3.1190,
            Longitude = -60.0217,
            Horario = "08:00 - 22:00",
            Cartao = true,
            Pix = true,
            Dinheiro = true,
            Chuveiro = false,
            Estacionamento = true,
            Cadeira = true,
            PetFriendly = true,
            Acessibilidade = true,
            Wifi = true,
            Description = "Melhor restaurante da região",
            BusinessPhotoUrl = "https://example.com/profile.jpg",
            CoverPhotoUrl = "https://example.com/header.jpg",
            CardImageUrl = "https://example.com/card.jpg",
            GalleryPhotos = []
        };
    }

    public static Business CreateValidBusinessEntity()
    {
        var userId = Guid.NewGuid();
        return new Business
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = "Restaurante João",
            ServiceType = BusinessServiceTypeEnum.BaresERestaurantes,
            Address = "Rua das Flores, 123",
            Latitude = -3.1190,
            Longitude = -60.0217,
            BusinessPhotoUrl = "https://example.com/profile.jpg",
            CoverPhotoUrl = "https://example.com/header.jpg",
            CardImageUrl = "https://example.com/card.jpg",
            Status = true,
            Horario = "08:00 - 22:00",
            Cartao = true,
            Pix = true,
            Dinheiro = true,
            Chuveiro = false,
            Estacionamento = true,
            Cadeira = true,
            PetFriendly = true,
            Acessibilidade = true,
            Wifi = true,
            Description = "Melhor restaurante da região",
            User = new User
            {
                Id = userId,
                Name = "João Silva",
                Email = "joao@example.com",
                Phone = "85987654321"
            },
            Photos = []
        };
    }

    public static SearchBusinessRequest CreateSearchRequest()
    {
        return new SearchBusinessRequest
        {
            Page = 1,
            PageSize = 10
        };
    }
}
