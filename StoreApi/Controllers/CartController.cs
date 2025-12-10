using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreApi.Data;
using StoreApi.Models;
using System.Security.Claims;

namespace StoreApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly StoreDbContext _context;

        public CartController(StoreDbContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        // GET: api/cart
        [HttpGet]
        public async Task<ActionResult<Cart>> GetCart()
        {
            var userId = GetUserId();
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return Ok(new Cart { UserId = userId, Items = new List<CartItem>() });
            }
            return cart;
        }

        // POST: api/cart/add?productId=1&quantity=1
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(int productId, int quantity)
        {
            var userId = GetUserId();
            var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (existingItem != null)
                existingItem.Quantity += quantity;
            else
                cart.Items.Add(new CartItem { ProductId = productId, Quantity = quantity });

            await _context.SaveChangesAsync();
            return Ok("Produto adicionado.");
        }

        // DELETE: api/cart/remove?productId=1
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            var userId = GetUserId();
            var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return NotFound();

            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (item == null) return NotFound();

            cart.Items.Remove(item);
            await _context.SaveChangesAsync();
            return Ok("Produto removido.");
        }
    }
}