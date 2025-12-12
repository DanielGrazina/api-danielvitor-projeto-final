using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using StoreApi.Models;
using StoreApi.Data;
using System.Text.Json;

namespace StoreApi.Services
{
    public class OrderService : IOrderService
    {
        private readonly StoreDbContext _context;
        private readonly IDistributedCache _cache;

        public OrderService(StoreDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId)
        {
            string cacheKey = $"user_orders_{userId}";

            try
            {
                var cached = await _cache.GetStringAsync(cacheKey);
                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<IEnumerable<Order>>(cached) ?? new List<Order>();
                }
            }
            catch { }

            var orders = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            try
            {
                var options = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(5)
                };
                var jsonOptions = new JsonSerializerOptions
                {
                    ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles
                };

                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(orders, jsonOptions), options);
            }
            catch { }

            return orders;
        }
    }
}
