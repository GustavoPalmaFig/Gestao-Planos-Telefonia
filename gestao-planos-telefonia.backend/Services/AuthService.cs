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
    private const int saltSize = 16;
    private const int hashSize = 64;
    private const int iterations = 350000;
    private readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

    public async Task<GoogleJsonWebSignature.Payload?> ValidateGoogleToken(string idToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings { Audience = [googleClientId] };
        return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
    }

    private static List<Claim> GenerateClaims(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new (ClaimTypes.Name, user.Name)
        };

        if (!string.IsNullOrEmpty(user.Email))
        {
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
        }

        return claims;
    }

    private string GenerateJwtToken(List<Claim> claims)
    {
        var key = Encoding.ASCII.GetBytes(secretId);

        
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

    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(saltSize);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithm, hashSize);
        
        return $"{Convert.ToHexString(hash)}-{Convert.ToHexString(salt)}";
    }

    public bool VerifyPassword(string password, string hash)
    {
        var parts = hash.Split('-');
        byte[] hashBytes = Convert.FromHexString(parts[0]);
        byte[] salt = Convert.FromHexString(parts[1]);

        byte[] testHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithm, hashSize);

        return CryptographicOperations.FixedTimeEquals(hashBytes, testHash);

    }

    public async Task<string> HandleGoogleLogin(GoogleJsonWebSignature.Payload payload)
    {
        User? user = await authRepository.GetUserByEmailAsync(payload.Email);

        if (user is null)
        {
            user = new User
            {
                Email = payload.Email,
                Name = payload.Name,
                GoogleId = payload.Subject,
                LastLoginAt = DateTime.UtcNow
            };

            await authRepository.AddUserAsync(user);
        }

        await authRepository.UpdateLastLoginAsync(user);
        var claims = GenerateClaims(user);
        return GenerateJwtToken(claims);
    }

    public async Task<string?> CreateUserAsync(User user)
    {
        if (await authRepository.Exists(user.Email!))
        {
            return null;
        }

        user.PasswordHash = HashPassword(user.PasswordHash!);
        User registeredUser = await authRepository.AddUserAsync(user);
        var claims = GenerateClaims(registeredUser);
        return GenerateJwtToken(claims);
    }

    public async Task<string> HandleLogin(LoginRequest request)
    {
        User? user = await authRepository.GetUserByEmailAsync(request.Email);

        if (user is null || !VerifyPassword(request.Password, user.PasswordHash!))
        {
            throw new UnauthorizedAccessException("Credenciais inválidas");
        }

        await authRepository.UpdateLastLoginAsync(user);
        var claims = GenerateClaims(user);
        return GenerateJwtToken(claims);
    }

    public string GuestLogin()
    {
        var claims = new List<Claim> { new ("role", "guest") };
        return GenerateJwtToken(claims);
    }
}
