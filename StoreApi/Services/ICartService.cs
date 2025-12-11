using StoreApi.Models;

namespace StoreApi.Services
{
    public interface ICartService
    {
        Task<Cart> GetCartAsync(int userId);

        Task AddItemAsync(int userId, int productId, int quantity);

        Task<bool> RemoveItemAsync(int userId, int productId);
    }
}