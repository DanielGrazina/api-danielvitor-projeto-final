using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using StoreApi.Data;
using StoreApi.DTOs;
using StoreApi.Models;
using System.Text.Json;

namespace StoreApi.Services
{
    public class ProductService : IProductService
    {
        private readonly StoreDbContext _context;
        private readonly IDistributedCache _cache;
        private const string CacheKey = "products_with_category"; // Chave centralizada

        public ProductService(StoreDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var cached = await _cache.GetStringAsync(CacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                return JsonSerializer.Deserialize<List<ProductDto>>(cached,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                    ?? new List<ProductDto>();
            }

            // Se falhar, ler da Base de Dados
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

            // Guardar no Redis (Expira em 2 minutos)
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
            };

            await _cache.SetStringAsync(CacheKey, JsonSerializer.Serialize(products), options);

            return products;
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Invalidar o cache para a lista atualizar
            await _cache.RemoveAsync(CacheKey);

            return product;
        }

        public async Task<bool> UpdateAsync(int id, ProductDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Stock = productDto.Stock;

            if (productDto.CategoryId != 0)
                product.CategoryId = productDto.CategoryId;

            await _context.SaveChangesAsync();

            // Invalidar o cache
            await _cache.RemoveAsync(CacheKey);

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            // Invalidar o cache
            await _cache.RemoveAsync(CacheKey);

            return true;
        }
    }
}