using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace Controllers;

[ApiController]
[Route("[controller]")]
public class PlanoController : ControllerBase
{
    private readonly IPlanoService PlanoService;

    public PlanoController(IPlanoService _PlanoService)
    {
        PlanoService = _PlanoService;
    }

    [HttpGet]
    [Route("GetAllPlanos")]
    public async Task<IActionResult> GetAllPlanos()
    {
        try
        {
            var Planos = await PlanoService.GetAllPlanosAsync();
            return Ok(Planos);
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpGet]
    [Route("GetPlanoById/{id}")]
    public async Task<IActionResult> GetPlanoById(int id)
    {
        try
        {
            var Plano = await PlanoService.GetPlanoByIdAsync(id);
            return Ok(Plano);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    [Route("CreatePlano")]
    public async Task<IActionResult> CreatePlano([FromBody] Plano Plano)
    {
        try
        {
            var newPlano = await PlanoService.CreatePlanoAsync(Plano);
            return CreatedAtAction(nameof(GetPlanoById), new { id = newPlano.Id }, newPlano);
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpPut]
    [Route("UpdatePlano/{id}")]
    public async Task<IActionResult> UpdatePlano(int id, [FromBody] Plano Plano)
    {
        try
        {
            var updatedPlano = await PlanoService.UpdatePlanoAsync(id, Plano);
            return Ok(updatedPlano);
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpDelete]
    [Route("DeletePlano/{id}")]
    public async Task<IActionResult> DeletePlano(int id)
    {
        try
        {
            await PlanoService.DeletePlanoAsync(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }
}