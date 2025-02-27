namespace Gestão_Planos_Telefonia.backend.Models
{
    public class ClientePlano
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public Guid PlanoId { get; set; }
        public Plano? Plano { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
