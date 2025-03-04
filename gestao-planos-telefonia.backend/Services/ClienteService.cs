using Models;
using Repository;

namespace Services;

public class ClienteService(IClienteRepository _clienteRepository) : IClienteService
{
    private readonly IClienteRepository clienteRepository = _clienteRepository;

    public async Task<List<Cliente>> GetAllClientesAsync()
    {
        return await clienteRepository.GetAllAsync();
    }

    public async Task<Cliente> GetClienteByIdAsync(int id)
    {
        Cliente cliente = await clienteRepository.GetByIdAsync(id);
        return cliente ?? throw new KeyNotFoundException("Cliente not found");
    }

    public async Task<Cliente> CreateClienteAsync(Cliente cliente)
    {
        SetDates(cliente);
        return await clienteRepository.AddAsync(cliente);
    }

    public async Task<Cliente> UpdateClienteAsync(int id, Cliente cliente)
    {
        var dbCliente = await clienteRepository.GetByIdAsync(id);
        if (dbCliente == null)
        {
            throw new KeyNotFoundException("Cliente not found");
        }

        SetDates(cliente);
        return await clienteRepository.UpdateAsync(dbCliente, cliente);
    }

    public async Task DeleteClienteAsync(int id)
    {
        var cliente = await clienteRepository.GetByIdAsync(id);
        if (cliente == null)
        {
            throw new KeyNotFoundException("Cliente not found");
        }

        await clienteRepository.DeleteAsync(cliente);
    }

    private static void SetDates(Cliente cliente)
    {
        cliente.CreatedAt = DateTime.Now;
        cliente.UpdatedAt = DateTime.Now;
        cliente.ClientesPlanos.ForEach(cp => cp.CreatedAt = DateTime.Now);
    }
}