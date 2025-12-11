using Microsoft.EntityFrameworkCore;
using StoreApi.Data;
using StoreApi.Models;

namespace StoreApi.Services
{
    public class CartService : ICartService
    {
        private readonly StoreDbContext _context;

        public CartService(StoreDbContext context)
        {
            _context = context;
        }

        public async Task<Cart> GetCartAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product) // Incluir detalhes do produto
                .FirstOrDefaultAsync(c => c.UserId == userId);

            return cart ?? new Cart { UserId = userId, Items = new List<CartItem>() };
        }

        public async Task AddItemAsync(int userId, int productId, int quantity)
        {
            // Obter ou criar carrinho
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = productId,
                    Quantity = quantity
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> RemoveItemAsync(int userId, int productId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return false;

            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (item == null) return false;

            cart.Items.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}