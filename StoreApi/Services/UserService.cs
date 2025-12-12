using Microsoft.EntityFrameworkCore;
using StoreApi.Data;
using StoreApi.DTOs;
using StoreApi.Models;

namespace StoreApi.Services
{
    public class UserService : IUserService
    {
        private readonly StoreDbContext _context;

        public UserService(StoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<UserDto?> CreateAsync(User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return null;
            }

            if (string.IsNullOrEmpty(user.Role)) user.Role = "Customer";

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<bool> UpdateRoleAsync(int id, string newRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            if (user.Email == "daniel@gmail.com" && newRole != "Manager")
            {
                throw new InvalidOperationException("Não podes despromover o Super Admin.");
            }

            user.Role = newRole;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateProfileAsync(int userId, string name, string? password)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.Name = name;

            if(!string.IsNullOrEmpty(password))
            {
                user.Password = password;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}