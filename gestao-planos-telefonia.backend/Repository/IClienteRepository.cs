using Models;

namespace Repository;

public interface IClienteRepository
{
    Task<List<Cliente>> GetAllAsync();
    Task<Cliente> GetByIdAsync(int id);
    Task<Cliente> AddAsync(Cliente cliente);
    Task<Cliente> UpdateAsync(Cliente dbCliente, Cliente cliente);
    Task DeleteAsync(Cliente cliente);
}
