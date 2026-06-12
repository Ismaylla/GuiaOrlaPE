using GuiaOrlaPE.API.Domain.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GuiaOrlaPE.API.Domain.Entities;

[Table("businesses")]
public class Business
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public BusinessServiceTypeEnum ServiceType { get; set; }

    [Required]
    [MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    [Required]
    public double Latitude { get; set; }

    [Required]
    public double Longitude { get; set; }

    [MaxLength(500)]
    public string BusinessPhotoUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string CoverPhotoUrl { get; set; } = string.Empty;

    [Required]
    public bool Status { get; set; }

    // Campos de comodidades e filtros que adicionei para busca
    [Required]
    public bool Cartao { get; set; }

    [Required]
    public bool Pix { get; set; }

    [Required]
    public bool Dinheiro { get; set; }

    [Required]
    public bool Chuveiro { get; set; }

    [Required]
    public bool Estacionamento { get; set; }

    [Required]
    public bool Cadeira { get; set; }

    [Required]
    public bool PetFriendly { get; set; }

    [Required]
    public bool Acessibilidade { get; set; }


    [Required] // Adicione esta linha
    public bool Wifi { get; set; }

    // Campo de horário que implementei para controlar o funcionamento
    [MaxLength(100)]
    public string Horario { get; set; } = "08:00 às 18:00";

    // ADICIONEI ESTES DOIS CAMPOS NOVOS AQUI:
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public virtual ICollection<BusinessPhoto> Photos { get; set; } = new List<BusinessPhoto>();

    // ---


    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}