using Gestão_Planos_Telefonia.backend.Models;
using Gestão_Planos_Telefonia.backend.Repository;

namespace Gestão_Planos_Telefonia.backend.Services
{
    public class PlanoService(IPlanoRepository _PlanoRepository) : IPlanoService
    {
        private readonly IPlanoRepository PlanoRepository = _PlanoRepository;

        public async Task<List<Plano>> GetAllPlanosAsync()
        {
            return await PlanoRepository.GetAllAsync();
        }

        public async Task<Plano> GetPlanoByIdAsync(Guid id)
        {
            Plano Plano = await PlanoRepository.GetByIdAsync(id);
            return Plano ?? throw new KeyNotFoundException("Plano not found");
        }

        public async Task<Plano> CreatePlanoAsync(Plano plano)
        {
            SetDates(plano);
            return await PlanoRepository.AddAsync(plano);
        }

        public async Task<Plano> UpdatePlanoAsync(Guid id, Plano plano)
        {
            var dbPlano = await PlanoRepository.GetByIdAsync(id);
            if (dbPlano == null)
            {
                throw new KeyNotFoundException("Plano not found");
            }

            SetDates(plano);
            return await PlanoRepository.UpdateAsync(dbPlano, plano);
        }

        public async Task DeletePlanoAsync(Guid id)
        {
            var Plano = await PlanoRepository.GetByIdAsync(id);
            if (Plano == null)
            {
                throw new KeyNotFoundException("Plano not found");
            }

            await PlanoRepository.DeleteAsync(Plano);
        }

        private static void SetDates(Plano plano)
        {
            plano.CreatedAt = DateTime.Now;
            plano.UpdatedAt = DateTime.Now;
        }
    }
}