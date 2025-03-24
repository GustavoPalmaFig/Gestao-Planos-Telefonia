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

            return Ok(new { jwtToken });
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpPost("CreateUser")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        try
        {
            var token = await authService.CreateUserAsync(user);
            if (token == null)
                return Conflict("Este e-mail já está sendo utilizado.");

            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var token = await authService.HandleLogin(request);
            return Ok(new { token });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }

    [HttpPost("GuestLogin")]
    public IActionResult GenerateGuestToken()
    {
        try
        {
            var token = authService.GuestLogin();
            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return BadRequest("Erro:" + ex.Message);
        }
    }
}