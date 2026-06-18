using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GuiaOrlaPE.API.Domain.Entities;

[Table("business_photos")]
public class BusinessPhoto
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid BusinessId { get; set; }

    [Required]
    [MaxLength(500)]
    public string PhotoUrl { get; set; } = string.Empty;

    [ForeignKey(nameof(BusinessId))]
    public Business Business { get; set; } = null!;
}