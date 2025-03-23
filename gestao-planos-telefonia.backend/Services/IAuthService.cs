using Google.Apis.Auth;
using Models;

namespace Services;

public interface IAuthService
{
    Task<GoogleJsonWebSignature.Payload?> ValidateGoogleToken(string idToken);
    Task<string> HandleGoogleLogin(GoogleJsonWebSignature.Payload payload);
}
