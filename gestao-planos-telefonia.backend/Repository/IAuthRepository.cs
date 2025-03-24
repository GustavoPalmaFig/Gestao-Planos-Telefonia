using Models;

namespace Repository;

public interface IAuthRepository
{
    Task<bool> Exists(string email);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User> AddUserAsync(User user);
    Task UpdateLastLoginAsync(User user);
}
