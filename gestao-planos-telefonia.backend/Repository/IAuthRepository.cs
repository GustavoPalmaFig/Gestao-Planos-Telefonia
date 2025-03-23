using Models;

namespace Repository;

public interface IAuthRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User> AddUserAsync(User user);
}
