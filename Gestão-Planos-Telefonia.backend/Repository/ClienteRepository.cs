﻿using Gestão_Planos_Telefonia.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Gestão_Planos_Telefonia.backend.Repository
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly TelefoniaContext context;

        public ClienteRepository(TelefoniaContext _context)
        {
            context = _context;
        }

        public async Task<List<Cliente>> GetAllAsync()
        {
            return await context.Clientes.Include(c => c.ClientesPlanos).ThenInclude(cp => cp.Plano).ToListAsync();
        }

        public async Task<Cliente> GetByIdAsync(Guid id)
        {
            return await context.Clientes.Include(c => c.ClientesPlanos).ThenInclude(cp => cp.Plano).FirstAsync(c => c.Id == id);
        }

        public async Task<Cliente> AddAsync(Cliente cliente)
        {
            await context.Clientes.AddAsync(cliente);
            await context.SaveChangesAsync();
            return cliente;
        }

        public async Task<Cliente> UpdateAsync(Cliente dbCliente, Cliente cliente)
        {
            context.Entry(dbCliente).CurrentValues.SetValues(cliente);

            dbCliente.ClientesPlanos.Clear();
            dbCliente.ClientesPlanos.AddRange(cliente.ClientesPlanos);

            context.Clientes.Update(cliente);
            await context.SaveChangesAsync();
            return cliente;
        }

        public async Task DeleteAsync(Cliente cliente)
        {
            if (cliente.ClientesPlanos?.Count > 0)
            {
                context.ClientePlanos.RemoveRange(cliente.ClientesPlanos);
            }

            context.Clientes.Remove(cliente);
            await context.SaveChangesAsync();
        }
    }
}
