using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoreApi.Services;
using System.Security.Claims;

namespace StoreApi.Controllers
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;

        public CheckoutController(ICheckoutService checkoutService)
        {
            _checkoutService = checkoutService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Checkout()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized("Token inválido.");

                var userId = int.Parse(userIdClaim.Value);

                var result = await _checkoutService.ProcessCheckoutAsync(userId);

                if (!result.Success)
                {
                    return BadRequest(result.Message);
                }

                return Ok(result.CreatedOrder);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }
    }
}