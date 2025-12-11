using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoreApi.Models;
using StoreApi.Services;
using System.Security.Claims;

namespace StoreApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        // GET: api/cart
        [HttpGet]
        public async Task<ActionResult<Cart>> GetCart()
        {
            var userId = GetUserId();
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }

        // POST: api/cart/add?productId=1&quantity=1
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(int productId, int quantity)
        {
            var userId = GetUserId();
            await _cartService.AddItemAsync(userId, productId, quantity);
            return Ok("Produto adicionado ao carrinho.");
        }

        // DELETE: api/cart/remove?productId=1
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            var userId = GetUserId();
            var success = await _cartService.RemoveItemAsync(userId, productId);

            if (!success) return NotFound("Carrinho ou item não encontrado.");

            return Ok("Produto removido.");
        }
    }
}