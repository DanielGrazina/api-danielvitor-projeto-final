using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed; // Redis
using Microsoft.Extensions.Caching.Memory;      // Cache Local (RAM)
using StoreApi.Data;
using StoreApi.DTOs;
using StoreApi.Models;
using System.Text.Json;

namespace StoreApi.Services
{
    public class ProductService : IProductService
    {
        private readonly StoreDbContext _context;
        private readonly IDistributedCache _redisCache;
        private readonly IMemoryCache _localCache; // <--- NOVO
        private const string CacheKey = "products_with_category";

        public ProductService(StoreDbContext context, IDistributedCache redisCache, IMemoryCache localCache)
        {
            _context = context;
            _redisCache = redisCache;
            _localCache = localCache;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            if (_localCache.TryGetValue(CacheKey, out List<ProductDto>? localProducts))
            {
                Console.WriteLine("--> Obtido do Cache Local (RAM)");
                return localProducts!;
            }

            try
            {
                var redisCached = await _redisCache.GetStringAsync(CacheKey);
                if (!string.IsNullOrEmpty(redisCached))
                {
                    Console.WriteLine("--> Obtido do Redis");
                    var productsDto = JsonSerializer.Deserialize<List<ProductDto>>(redisCached,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (productsDto != null)
                    {
                        SetLocalCache(productsDto);
                        return productsDto;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Redis Error] Ignorado: {ex.Message}");
            }

            Console.WriteLine("--> Obtido da Base de Dados");
            var products = await (
                from p in _context.Products
                join c in _context.Categories on p.CategoryId equals c.Id
                select new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = c.Name,
                    CategoryId = p.CategoryId
                }
            ).ToListAsync();

            try
            {
                await _redisCache.SetStringAsync(CacheKey, JsonSerializer.Serialize(products),
                    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2) });
            }
            catch {}
            
            SetLocalCache(products);

            return products;
        }

        private void SetLocalCache(List<ProductDto> products)
        {
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1),
                SlidingExpiration = TimeSpan.FromSeconds(30) // Se ninguém aceder em 30s, apaga
            };
            _localCache.Set(CacheKey, products, options);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            await InvalidateCaches();
            return product;
        }

        public async Task<bool> UpdateAsync(int id, ProductDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.Name = productDto.Name;
            product.Price = productDto.Price;

            await _context.SaveChangesAsync();
            await InvalidateCaches();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            await InvalidateCaches();
            return true;
        }

        private async Task InvalidateCaches()
        {
            _localCache.Remove(CacheKey); // Limpa RAM
            try { await _redisCache.RemoveAsync(CacheKey); } catch { } // Limpa Redis
        }
        public async Task<Product?> GetByIdAsync(int id) => await _context.Products.FindAsync(id);

    }
}