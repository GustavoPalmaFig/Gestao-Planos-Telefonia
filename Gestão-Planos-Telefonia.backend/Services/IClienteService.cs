using Gestão_Planos_Telefonia.backend.Models;

namespace Gestão_Planos_Telefonia.backend.Services
{
    public interface IClienteService
    {
        Task<List<Cliente>> GetAllClientesAsync();
        Task<Cliente> GetClienteByIdAsync(Guid id);
        Task<Cliente> CreateClienteAsync(Cliente cliente);
        Task<Cliente> UpdateClienteAsync(Guid id, Cliente cliente);
        Task DeleteClienteAsync(Guid id);
    }
}
