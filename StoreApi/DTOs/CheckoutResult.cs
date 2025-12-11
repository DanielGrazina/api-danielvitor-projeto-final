using StoreApi.Models;

namespace StoreApi.DTOs
{
    public class CheckoutResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public Order? CreatedOrder { get; set; }
    }
}