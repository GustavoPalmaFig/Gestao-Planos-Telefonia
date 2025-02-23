using Gestão_Planos_Telefonia.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Gestão_Planos_Telefonia.backend.Repository
{
    public class PlanoRepository : IPlanoRepository
    {
        private readonly TelefoniaContext context;

        public PlanoRepository(TelefoniaContext _context)
        {
            context = _context;
        }

        public async Task<List<Plano>> GetAllAsync()
        {
            return await context.Planos.Include(c => c.ClientesPlanos).ThenInclude(cp => cp.Cliente).ToListAsync();
        }

        public async Task<Plano> GetByIdAsync(Guid id)
        {
            return await context.Planos.FirstAsync(p => p.Id == id);
        }

        public async Task<Plano> AddAsync(Plano Plano)
        {
            await context.Planos.AddAsync(Plano);
            await context.SaveChangesAsync();
            return Plano;
        }

        public async Task<Plano> UpdateAsync(Plano dbPlano, Plano Plano)
        {
            context.Entry(dbPlano).CurrentValues.SetValues(Plano);
            await context.SaveChangesAsync();
            return Plano;
        }

        public async Task DeleteAsync(Plano Plano)
        {
            context.Planos.Remove(Plano);
            await context.SaveChangesAsync();
        }
    }
}
