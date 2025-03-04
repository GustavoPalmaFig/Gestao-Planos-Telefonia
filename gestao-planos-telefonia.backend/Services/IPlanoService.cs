using Models;

namespace Services;

public interface IPlanoService
{
    Task<List<Plano>> GetAllPlanosAsync();
    Task<Plano> GetPlanoByIdAsync(int id);
    Task<Plano> CreatePlanoAsync(Plano Plano);
    Task<Plano> UpdatePlanoAsync(int id, Plano Plano);
    Task DeletePlanoAsync(int id);
}
