using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("ClientePlano")]
public class ClientePlano
{
    [Column("id")]
    public int? Id { get; set; }

    [Column("clienteId")]
    public int ClienteId { get; set; }
    public Cliente? Cliente { get; set; }

    [Column("planoId")]
    public int PlanoId { get; set; }
    public Plano? Plano { get; set; }

    [Column("createdAt")]
    public DateTime? CreatedAt { get; set; }
}
