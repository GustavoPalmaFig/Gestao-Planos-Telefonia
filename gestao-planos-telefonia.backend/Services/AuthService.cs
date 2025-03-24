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
    private readonly int saltSize = 16;
    private readonly int keySize = 64;
    private readonly int iterations = 350000;
    private readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

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

    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(keySize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            iterations,
            hashAlgorithm,
            keySize
        );
        var hashBytes = new byte[saltSize + keySize];
        Array.Copy(salt, 0, hashBytes, 0, saltSize);
        Array.Copy(hash, 0, hashBytes, saltSize, keySize);
        return Convert.ToHexString(hashBytes);
    }

    public bool VerifyPassword(string password, string hash)
    {
        var hashBytes = Convert.FromHexString(hash);
        var salt = new byte[saltSize];
        Array.Copy(hashBytes, 0, salt, 0, saltSize);
        var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            iterations,
            hashAlgorithm,
            keySize
        );
        for (int i = 0; i < keySize; i++)
        {
            if (hashBytes[i + saltSize] != hashToCompare[i])
            {
                return false;
            }
        }
        return true;
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

    public async Task<string?> CreateUserAsync(User user)
    {
        if (await authRepository.GetUserByEmailAsync(user.Email!) != null)
            return null;

        user.PasswordHash = HashPassword(user.PasswordHash!);
        User registeredUser = await authRepository.AddUserAsync(user);
        return GenerateJwtToken(registeredUser);
    }

    public async Task<string> HandleLogin(LoginRequest request)
    {
        User? user = await authRepository.GetUserByEmailAsync(request.Email);

        if (user == null || !VerifyPassword(request.Password, user.PasswordHash!))
            throw new UnauthorizedAccessException("Credenciais inválidas");

        return GenerateJwtToken(user);
    }
}
