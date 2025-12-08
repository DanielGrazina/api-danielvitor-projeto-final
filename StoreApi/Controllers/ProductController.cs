using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using StoreApi.Data;
using StoreApi.Models;
using System.Text.Json;

namespace StoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly StoreDbContext _context;
        private readonly IDistributedCache _cache;

        public ProductsController(StoreDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            var cached = await _cache.GetStringAsync("products_with_category");

            if (cached != null)
            {
                var productsCached =
                    JsonSerializer.Deserialize<List<object>>(cached);

                return Ok(productsCached);
            }

            var products = await (
                from p in _context.Products
                join c in _context.Categories
                    on p.CategoryId equals c.Id
                select new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Stock,
                    CategoryName = c.Name
                }
            ).ToListAsync();

            await _cache.SetStringAsync(
                "products_with_category",
                JsonSerializer.Serialize(products),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
                }
            );
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? NotFound() : product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> Create(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product product)
        {
            if (id != product.Id)
                return BadRequest();

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}