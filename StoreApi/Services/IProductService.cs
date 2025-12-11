using StoreApi.DTOs;
using StoreApi.Models;

namespace StoreApi.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<bool> UpdateAsync(int id, ProductDto productDto);
        Task<bool> DeleteAsync(int id);
    }
}