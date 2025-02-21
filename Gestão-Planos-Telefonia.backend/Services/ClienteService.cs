using Gestão_Planos_Telefonia.backend.Models;
using Gestão_Planos_Telefonia.backend.Repository;

namespace Gestão_Planos_Telefonia.backend.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository clienteRepository;

        public ClienteService(IClienteRepository _clienteRepository)
        {
            clienteRepository = _clienteRepository;
        }

        public async Task<List<Cliente>> GetAllClientesAsync()
        {
            return await clienteRepository.GetAllAsync();
        }

        public async Task<Cliente> GetClienteByIdAsync(Guid id)
        {
            Cliente cliente = await clienteRepository.GetByIdAsync(id);
            return cliente ?? throw new KeyNotFoundException("Cliente not found");
        }

        public async Task<Cliente> CreateClienteAsync(Cliente cliente)
        {
            return await clienteRepository.AddAsync(cliente);
        }

        public async Task<Cliente> UpdateClienteAsync(Guid id, Cliente cliente)
        {
            var dbCliente = await clienteRepository.GetByIdAsync(id);
            if (dbCliente == null)
            {
                throw new KeyNotFoundException("Cliente not found");
            }


            //dbCliente.Nome = cliente.Nome ?? cliente.Nome;
            //dbCliente.CPF = cliente.CPF ?? cliente.CPF;
            //dbCliente.Telefone = cliente.Telefone ?? cliente.Telefone;
            //dbCliente.Email = cliente.Email ?? cliente.Email;

            //return await _clienteRepository.UpdateAsync(cliente);
            return await clienteRepository.UpdateAsync(dbCliente, cliente);
        }

        public async Task DeleteClienteAsync(Guid id)
        {
            var cliente = await clienteRepository.GetByIdAsync(id);
            if (cliente == null)
            {
                throw new KeyNotFoundException("Cliente not found");
            }

            await clienteRepository.DeleteAsync(cliente);
        }
    }
}