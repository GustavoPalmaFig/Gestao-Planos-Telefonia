using Models;

namespace Repository;

public interface IPlanoRepository
{
    Task<List<Plano>> GetAllAsync();
    Task<Plano> GetByIdAsync(int id);
    Task<Plano> AddAsync(Plano Plano);
    Task<Plano> UpdateAsync(Plano dbPlano, Plano Plano);
    Task DeleteAsync(Plano Plano);
}
