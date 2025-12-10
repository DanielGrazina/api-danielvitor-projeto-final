using Microsoft.AspNetCore.Mvc;
using StoreApi.Data;
using StoreApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using StoreApi.DTOs;

namespace StoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly StoreDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(StoreDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null)
                return Unauthorized(new { message = "Email inválido." });

            if (user.Password != login.Password)
                return Unauthorized(new { message = "Password incorreta." });

            // Criar o Token
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("name", user.Name),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                message = "Login efetuado com sucesso!",
                token = tokenString
            });
        }
    }
}