using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("Cliente")]
public class Cliente
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [Column("cpf")]
    public string CPF { get; set; } = string.Empty;

    [Required]
    [Column("telefone")]
    public string Telefone { get; set; } = string.Empty;

    [Required]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("createAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    public List<ClientePlano> ClientesPlanos { get; set; } = new();
}
