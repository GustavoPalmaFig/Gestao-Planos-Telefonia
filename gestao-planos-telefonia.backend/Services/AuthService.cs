using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Models;
using Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Services;
public class AuthService(IAuthRepository _authRepository) : IAuthService
{
    private readonly IAuthRepository authRepository = _authRepository;
    private readonly string googleClientId = Environment.GetEnvironmentVariable("googleClientId")!;
    private readonly string secretId = Environment.GetEnvironmentVariable("secretId")!;

    public async Task<GoogleJsonWebSignature.Payload?> ValidateGoogleToken(string idToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings { Audience = [googleClientId] };
        return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
    }

    public string GenerateJwtToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(secretId);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new (ClaimTypes.Name, user.Name)
        };

        if (!string.IsNullOrEmpty(user.Email))
        {
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
        }

        if (user.IsGuest)
        {
            claims.Add(new Claim("role", "guest"));
        }
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<string> HandleGoogleLogin(GoogleJsonWebSignature.Payload payload)
    {
        User? user = await authRepository.GetUserByEmailAsync(payload.Email);

        if (user == null)
        {
            user = new User
            {
                Email = payload.Email,
                Name = payload.Name,
                GoogleId = payload.Subject,
                IsGuest = false,
                LastLoginAt = DateTime.UtcNow
            };

            await authRepository.AddUserAsync(user);
        }

        return GenerateJwtToken(user);
    }
}
