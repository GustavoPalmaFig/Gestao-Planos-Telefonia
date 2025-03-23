using Gestão_Planos_Telefonia.backend;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Repository;

public class AuthRepository(TelefoniaContext _context) : IAuthRepository
{
    private readonly TelefoniaContext context = _context;

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User> AddUserAsync(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        return user;
    }
}
