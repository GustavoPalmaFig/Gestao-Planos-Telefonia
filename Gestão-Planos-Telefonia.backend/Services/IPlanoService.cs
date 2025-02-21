using Gestão_Planos_Telefonia.backend.Models;

namespace Gestão_Planos_Telefonia.backend.Services
{
    public interface IPlanoService
    {
        Task<List<Plano>> GetAllPlanosAsync();
        Task<Plano> GetPlanoByIdAsync(Guid id);
        Task<Plano> CreatePlanoAsync(Plano Plano);
        Task<Plano> UpdatePlanoAsync(Guid id, Plano Plano);
        Task DeletePlanoAsync(Guid id);
    }
}
