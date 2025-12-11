using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using StoreApi.Data;
using StoreApi.Models;
using System.Text.Json;

namespace StoreApi.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly StoreDbContext _context;
        private readonly IDistributedCache _cache;

        private const string CacheKey = "all_categories";

        public CategoryService(StoreDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            try
            {
                var cached = await _cache.GetStringAsync(CacheKey);
                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<List<Category>>(cached) ?? new List<Category>();
                }
            }
            catch (Exception ex)
            {
                // Se o Redis estiver em baixo, logamos o erro mas NÃO paramos a aplicação
                Console.WriteLine($"[Cache Error] Não foi possível ler do Redis: {ex.Message}");
            }

            var categories = await _context.Categories.ToListAsync();

            try
            {
                var options = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                };

                await _cache.SetStringAsync(CacheKey, JsonSerializer.Serialize(categories), options);
            }
            catch
            {
                Console.WriteLine("[Cache Error] Não foi possível guardar no Redis.");
            }

            return categories;
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<Category> CreateAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // INVALIDAÇÃO DE CACHE
            await InvalidateCacheAsync();

            return category;
        }

        public async Task<bool?> UpdateAsync(int id, Category category)
        {
            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null) return null;

            existingCategory.Name = category.Name;
            await _context.SaveChangesAsync();

            // INVALIDAÇÃO DE CACHE
            await InvalidateCacheAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            bool hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
            {
                throw new InvalidOperationException("Não é possível apagar: Existem produtos nesta categoria.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            // INVALIDAÇÃO DE CACHE
            await InvalidateCacheAsync();

            return true;
        }

        // Método auxiliar para limpar o cache sem repetir código
        private async Task InvalidateCacheAsync()
        {
            try
            {
                await _cache.RemoveAsync(CacheKey);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Cache Error] Falha ao limpar cache: {ex.Message}");
            }
        }
    }
}