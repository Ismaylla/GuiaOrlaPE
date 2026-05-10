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

    /// <summary>
    /// true = ativo
    /// false = inativo
    /// </summary>
    [Required]
    public bool Status { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

}
