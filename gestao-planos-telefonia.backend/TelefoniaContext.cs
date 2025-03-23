using Microsoft.EntityFrameworkCore;
using Models;

namespace Gestão_Planos_Telefonia.backend
{
    public class TelefoniaContext : DbContext
    {
        public TelefoniaContext(DbContextOptions<TelefoniaContext> options) : base(options) {
            ChangeTracker.LazyLoadingEnabled = false;
        }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Plano> Planos { get; set; }
        public DbSet<ClientePlano> ClientePlanos { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClientePlano>()
                .HasOne(cp => cp.Cliente)
                .WithMany(c => c.ClientesPlanos)
                .HasForeignKey(cp => cp.ClienteId);

            modelBuilder.Entity<ClientePlano>()
                .HasOne(cp => cp.Plano)
                .WithMany(p => p.ClientesPlanos)
                .HasForeignKey(cp => cp.PlanoId);
        }
    }
}
