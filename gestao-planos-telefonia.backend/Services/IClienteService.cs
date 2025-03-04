using Models;

namespace Services;

public interface IClienteService
{
    Task<List<Cliente>> GetAllClientesAsync();
    Task<Cliente> GetClienteByIdAsync(int id);
    Task<Cliente> CreateClienteAsync(Cliente cliente);
    Task<Cliente> UpdateClienteAsync(int id, Cliente cliente);
    Task DeleteClienteAsync(int id);
}
