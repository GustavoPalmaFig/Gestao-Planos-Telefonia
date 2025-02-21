using System.ComponentModel.DataAnnotations;

namespace Gestão_Planos_Telefonia.backend.Models
{
    public class Plano
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public string Nome { get; set; } = string.Empty;
        [Required]
        public decimal Preco { get; set; }
        [Required]
        public int FranquiaDados { get; set; }  // GB
        [Required]
        public int MinutosLigacao { get; set; }

        public List<ClientePlano> ClientesPlanos { get; set; } = new();
    }
}
