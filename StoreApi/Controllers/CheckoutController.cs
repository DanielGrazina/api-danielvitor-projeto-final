using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StoreApi.Data;
using StoreApi.Models;
using System.Security.Claims;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace StoreApi.Controllers
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckoutController : ControllerBase
    {
        private readonly StoreDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public CheckoutController(StoreDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Checkout()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || cart.Items.Count == 0)
                return BadRequest("Carrinho vazio");

            var order = new Order
            {
                UserId = userId,
                Total = cart.Items.Sum(i => i.Product.Price * i.Quantity),
                Items = cart.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    Price = i.Product.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            var client = _httpClientFactory.CreateClient("PaymentClient");

            var response = await client.PostAsync(
                "payment",
                new StringContent("{}", Encoding.UTF8, "application/json")
            );

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Pagamento mock -> " + json);


            _context.CartItems.RemoveRange(cart.Items);

            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}