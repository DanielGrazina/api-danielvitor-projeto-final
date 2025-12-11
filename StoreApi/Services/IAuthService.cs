using StoreApi.DTOs;

namespace StoreApi.Services
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(LoginDto loginDto);
    }
}