using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StoreApi.Data;
using StoreApi.Models;
using System.Security.Claims;
using System.Text;

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
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized("Utilizador não identificado.");

                var userId = int.Parse(userIdClaim.Value);

                var cart = await _context.Carts
                    .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || cart.Items.Count == 0)
                    return BadRequest("Carrinho vazio");

                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
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

                try
                {
                    var client = _httpClientFactory.CreateClient("PaymentClient");

                    var response = await client.PostAsync(
                        "payment",
                        new StringContent("{}", Encoding.UTF8, "application/json")
                    );

                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Aviso: Pagamento falhou com status {response.StatusCode}");
                    }
                    else
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Pagamento mock -> " + json);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"ERRO AO CONTACTAR IMPOSTER: {ex.Message}");
                }
                _context.CartItems.RemoveRange(cart.Items);
                await _context.SaveChangesAsync();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message} - {ex.InnerException?.Message}");
            }
        }
    }
}