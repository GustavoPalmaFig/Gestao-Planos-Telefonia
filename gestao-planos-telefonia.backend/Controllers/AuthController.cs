using Microsoft.AspNetCore.Mvc;
using Models;
using Repository;
using Services;
namespace Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(IAuthService _authService, IAuthRepository _authRepository) : ControllerBase
{
    private readonly IAuthService authService = _authService;
    private readonly IAuthRepository authRepository = _authRepository;

    [HttpPost("GoogleLogin")]
    public async Task<IActionResult> GoogleLogin([FromBody] string credential)
    {
        try
        {
            var payload = await authService.ValidateGoogleToken(credential);
            if (payload == null) return Unauthorized("Token Google inválido");

            var jwtToken = await authService.HandleGoogleLogin(payload);

            return Ok(new { token = jwtToken });
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }
}