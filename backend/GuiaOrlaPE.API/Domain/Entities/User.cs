using GuiaOrlaPE.API.Domain.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GuiaOrlaPE.API.Domain.Entities;

[Table("users")]
public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public UserProfileEnum Profile { get; set; }

    /// <summary>
    /// true = ativo
    /// false = inativo
    /// </summary>
    [Required]
    public bool Status { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public ICollection<Business> Businesses { get; set; } = [];
}
