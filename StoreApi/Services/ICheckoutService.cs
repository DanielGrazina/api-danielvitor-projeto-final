using StoreApi.DTOs;

namespace StoreApi.Services
{
    public interface ICheckoutService
    {
        Task<CheckoutResult> ProcessCheckoutAsync(int userId);
    }
}