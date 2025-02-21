using Gestão_Planos_Telefonia.backend.Models;

namespace Gestão_Planos_Telefonia.backend.Repository
{
    public interface IPlanoRepository
    {
        Task<List<Plano>> GetAllAsync();
        Task<Plano> GetByIdAsync(Guid id);
        Task<Plano> AddAsync(Plano Plano);
        Task<Plano> UpdateAsync(Plano dbPlano, Plano Plano);
        Task DeleteAsync(Plano Plano);
    }
}
