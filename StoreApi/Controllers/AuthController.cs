using Microsoft.AspNetCore.Mvc;
using StoreApi.Data;
using StoreApi.Models;
using StoreApi.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace StoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly StoreDbContext _context;

        public AuthController(StoreDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null)
                return Unauthorized(new { message = "Email inválido." });

            if (user.Password != login.Password)
                return Unauthorized(new { message = "Password incorreta." });

            return Ok(new
            {
                message = "Login efetuado com sucesso!",
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.CreatedAt
                }
            });
        }
    }
}