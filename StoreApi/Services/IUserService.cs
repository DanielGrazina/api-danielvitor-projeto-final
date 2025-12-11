using StoreApi.DTOs;
using StoreApi.Models;

namespace StoreApi.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(int id);
        Task<UserDto?> CreateAsync(User user);
        Task<bool> UpdateRoleAsync(int id, string newRole);
        Task<bool> DeleteAsync(int id);
    }
}