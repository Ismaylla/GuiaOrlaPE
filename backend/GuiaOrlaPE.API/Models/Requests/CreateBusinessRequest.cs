using GuiaOrlaPE.API.Domain.Enum;

namespace GuiaOrlaPE.API.Models.Requests;

public class CreateBusinessRequest
{
    public string Name { get; set; } = string.Empty;

    public BusinessServiceTypeEnum ServiceType { get; set; }

    public string Address { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public string BusinessPhotoUrl { get; set; } = string.Empty;

    public string Horario { get; set; } = "08:00 às 18:00";

    // Campos de pagamento que adicionei na requisição
    public bool Cartao { get; set; }

    public bool Pix { get; set; }

    public bool Dinheiro { get; set; }

    // Campos de comodidades que adicionei para o cadastro
    public bool Chuveiro { get; set; }

    public bool Estacionamento { get; set; }

    public bool Cadeira { get; set; }

    public bool PetFriendly { get; set; }

    public bool Acessibilidade { get; set; }

    public bool Wifi { get; set; }

    public string Description { get; set; } = string.Empty;
    
    public string CoverPhotoUrl { get; set; } = string.Empty;

    //  ADICIONADO: URL da foto da vitrine/card
    public string CardImageUrl { get; set; } = string.Empty;

    //  ADICIONADO: Lista contendo os caminhos das imagens da galeria de fotos do estabelecimento
    public List<string> GalleryPhotos { get; set; } = new();
}