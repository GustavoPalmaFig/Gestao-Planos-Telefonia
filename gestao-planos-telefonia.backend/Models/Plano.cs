using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("Plano")]
public class Plano
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [Column("preco")]
    public decimal Preco { get; set; }

    [Required]
    [Column("franquiaDados")]
    public int FranquiaDados { get; set; }  // GB

    [Required]
    [Column("minutosLigacao")]
    public int MinutosLigacao { get; set; }

    [Column("createAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    public List<ClientePlano> ClientesPlanos { get; set; } = new();
}
