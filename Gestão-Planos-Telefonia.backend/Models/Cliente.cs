using System.ComponentModel.DataAnnotations;

namespace Gestão_Planos_Telefonia.backend.Models
{
    public class Cliente
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public string Nome { get; set; } = string.Empty;
        [Required]
        public string CPF { get; set; } = string.Empty;
        [Required]
        public string Telefone { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;

        public List<ClientePlano> ClientesPlanos { get; set; } = new();
    }
}
