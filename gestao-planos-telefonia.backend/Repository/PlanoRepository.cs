using Gestão_Planos_Telefonia.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Gestão_Planos_Telefonia.backend.Repository
{
    public class PlanoRepository(TelefoniaContext _context) : IPlanoRepository
    {
        private readonly TelefoniaContext context = _context;

        public async Task<List<Plano>> GetAllAsync()
        {
            return await context.Planos.Include(c => c.ClientesPlanos).ThenInclude(cp => cp.Cliente).ToListAsync();
        }

        public async Task<Plano> GetByIdAsync(Guid id)
        {
            return await context.Planos.FirstAsync(p => p.Id == id);
        }

        public async Task<Plano> AddAsync(Plano plano)
        {
            await context.Planos.AddAsync(plano);
            await context.SaveChangesAsync();
            return plano;
        }

        public async Task<Plano> UpdateAsync(Plano dbPlano, Plano plano)
        {
            context.Entry(dbPlano).CurrentValues.SetValues(plano);
            await context.SaveChangesAsync();
            return plano;
        }

        public async Task DeleteAsync(Plano plano)
        {
            context.Planos.Remove(plano);
            await context.SaveChangesAsync();
        }
    }
}
