namespace GuiaOrlaPE.API.UnitTests.Fixtures;

public class BusinessControllerFixture
{
    public Mock<IBusinessService> BusinessServiceMock { get; set; }
    public Mock<ILogger<GuiaOrlaPE.API.Controller.BusinessController>> LoggerMock { get; set; }
    public GuiaOrlaPE.API.Controller.BusinessController BusinessController { get; set; }

    public BusinessControllerFixture()
    {
        BusinessServiceMock = new Mock<IBusinessService>();
        LoggerMock = new Mock<ILogger<GuiaOrlaPE.API.Controller.BusinessController>>();

        BusinessController = new GuiaOrlaPE.API.Controller.BusinessController(
            BusinessServiceMock.Object,
            LoggerMock.Object);
    }

    public void ResetMocks()
    {
        BusinessServiceMock.Reset();
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

    public static BusinessResponse CreateValidBusinessResponse()
    {
        var businessId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        return new BusinessResponse
        {
            Id = businessId,
            UserId = userId,
            Name = "Restaurante João",
            ServiceType = BusinessServiceTypeEnum.BaresERestaurantes,
            Address = "Rua das Flores, 123",
            Latitude = -3.1190,
            Longitude = -60.0217,
            BusinessPhotoUrl = "https://example.com/profile.jpg",
            CoverPhotoUrl = "https://example.com/header.jpg",
            CardImageUrl = "https://example.com/card.jpg",
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
            GalleryPhotos = []
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
