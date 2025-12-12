using StoreApi.Models;

namespace StoreApi.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId);
    }
}
