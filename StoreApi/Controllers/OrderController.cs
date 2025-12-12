using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreApi.Data;
using StoreApi.Models;
using StoreApi.Services;
using System.Security.Claims;

namespace StoreApi.Controllers
{
        [Authorize]
        [ApiController]
        [Route("api/[controller]")]
        public class OrdersController : ControllerBase
        {
            private readonly IOrderService _orderService;
            public OrdersController(IOrderService orderService)
            {
                _orderService = orderService;
            }

            // GET: api/Orders/my-orders
            [HttpGet("my-orders")]
            public async Task<IActionResult> GetMyOrders()
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var orders = await _orderService.GetOrdersByUserIdAsync(userId);
                return Ok(orders);
            }
        }
}
