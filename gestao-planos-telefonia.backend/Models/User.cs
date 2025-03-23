using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("User")]
public class User
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [EmailAddress]
    [Column("email")]
    public string? Email { get; set; }

    [Required]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("googleId")]
    public string? GoogleId { get; set; }

    [Column("passwordHash")]
    public string? PasswordHash { get; set; }

    [Column("isGuest")]
    public bool IsGuest { get; set; } = false;

    [Required]
    [Column("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("lastLoginAt")]
    public DateTime? LastLoginAt { get; set; }
}
