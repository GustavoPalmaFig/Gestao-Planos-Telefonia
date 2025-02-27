using Gestão_Planos_Telefonia.backend.Models;
using Gestão_Planos_Telefonia.backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Gestão_Planos_Telefonia.backend.Controllers;

[ApiController]
[Route("[controller]")]
public class ClienteController : ControllerBase
{
    private readonly IClienteService clienteService;

    public ClienteController(IClienteService _clienteService)
    {
        clienteService = _clienteService;
    }

    [HttpGet]
    [Route("GetAllClientes")]
    public async Task<IActionResult> GetAllClientes()
    {
        try
        {
            var clientes = await clienteService.GetAllClientesAsync();
            return Ok(clientes);
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpGet]
    [Route("GetClienteById/{id}")]
    public async Task<IActionResult> GetClienteById(Guid id)
    {
        try
        {
            var cliente = await clienteService.GetClienteByIdAsync(id);
            return Ok(cliente);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    [Route("CreateCliente")]
    public async Task<IActionResult> CreateCliente([FromBody] Cliente cliente)
    {
        try
        {
            var newCliente = await clienteService.CreateClienteAsync(cliente);
            return CreatedAtAction(nameof(GetClienteById), new { id = newCliente.Id }, newCliente);
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpPut]
    [Route("UpdateCliente/{id}")]
    public async Task<IActionResult> UpdateCliente(Guid id, [FromBody] Cliente cliente)
    {
        try
        {
            var updatedCliente = await clienteService.UpdateClienteAsync(id, cliente);
            return Ok(updatedCliente);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete]
    [Route("DeleteCliente/{id}")]
    public async Task<IActionResult> DeleteCliente(Guid id)
    {
        try
        {
            await clienteService.DeleteClienteAsync(id);
            return Ok();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}