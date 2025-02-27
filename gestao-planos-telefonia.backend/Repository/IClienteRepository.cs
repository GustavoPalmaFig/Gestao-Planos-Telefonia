using Gestão_Planos_Telefonia.backend.Models;

namespace Gestão_Planos_Telefonia.backend.Repository
{
    public interface IClienteRepository
    {
        Task<List<Cliente>> GetAllAsync();
        Task<Cliente> GetByIdAsync(Guid id);
        Task<Cliente> AddAsync(Cliente cliente);
        Task<Cliente> UpdateAsync(Cliente dbCliente, Cliente cliente);
        Task DeleteAsync(Cliente cliente);
    }
}
