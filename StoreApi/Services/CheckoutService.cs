using Microsoft.EntityFrameworkCore;
using StoreApi.Data;
using StoreApi.DTOs;
using StoreApi.Models;
using System.Text;

namespace StoreApi.Services
{
    public class CheckoutService : ICheckoutService
    {
        private readonly StoreDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public CheckoutService(StoreDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<CheckoutResult> ProcessCheckoutAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || cart.Items.Count == 0)
            {
                return new CheckoutResult { Success = false, Message = "Carrinho vazio." };
            }

            foreach (var item in cart.Items)
            {
                if (item.Product.Stock < item.Quantity)
                {
                    return new CheckoutResult
                    {
                        Success = false,
                        Message = $"Stock insuficiente para: {item.Product.Name}. Disponível: {item.Product.Stock}"
                    };
                }
                item.Product.Stock -= item.Quantity;
            }

            // Criar a Order
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

            // Guarda a Order e a atualização de Stock numa transação atómica
            await _context.SaveChangesAsync();

            // Imposter (Pagamento Mock)
            try
            {
                var client = _httpClientFactory.CreateClient("PaymentClient");
                var response = await client.PostAsync(
                    "payment",
                    new StringContent("{}", Encoding.UTF8, "application/json")
                );

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Aviso: Pagamento falhou. Status: {response.StatusCode}");
                }
                else
                {
                    Console.WriteLine("Pagamento mock processado com sucesso.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO IMPOSTER: {ex.Message}");
            }

            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();

            return new CheckoutResult { Success = true, CreatedOrder = order };
        }
    }
}