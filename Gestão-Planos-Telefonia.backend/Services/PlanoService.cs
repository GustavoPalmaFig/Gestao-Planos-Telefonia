using Gestão_Planos_Telefonia.backend.Models;
using Gestão_Planos_Telefonia.backend.Repository;

namespace Gestão_Planos_Telefonia.backend.Services
{
    public class PlanoService : IPlanoService
    {
        private readonly IPlanoRepository PlanoRepository;

        public PlanoService(IPlanoRepository _PlanoRepository)
        {
            PlanoRepository = _PlanoRepository;
        }

        public async Task<List<Plano>> GetAllPlanosAsync()
        {
            return await PlanoRepository.GetAllAsync();
        }

        public async Task<Plano> GetPlanoByIdAsync(Guid id)
        {
            Plano Plano = await PlanoRepository.GetByIdAsync(id);
            return Plano ?? throw new KeyNotFoundException("Plano not found");
        }

        public async Task<Plano> CreatePlanoAsync(Plano Plano)
        {
            return await PlanoRepository.AddAsync(Plano);
        }

        public async Task<Plano> UpdatePlanoAsync(Guid id, Plano Plano)
        {
            var dbPlano = await PlanoRepository.GetByIdAsync(id);
            if (dbPlano == null)
            {
                throw new KeyNotFoundException("Plano not found");
            }

            //context.Entry(dbDemand).CurrentValues.SetValues(demand);


            //dbPlano.Nome = Plano.Nome ?? Plano.Nome;
            //dbPlano.CPF = Plano.CPF ?? Plano.CPF;
            //dbPlano.Telefone = Plano.Telefone ?? Plano.Telefone;
            //dbPlano.Email = Plano.Email ?? Plano.Email;

            //return await _PlanoRepository.UpdateAsync(Plano);
            return await PlanoRepository.UpdateAsync(dbPlano, Plano);
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
    }
}