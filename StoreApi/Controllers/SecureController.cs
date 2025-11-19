using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace StoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SecureController : ControllerBase
    {
        [Authorize]
        [HttpGet("secret")]
        public IActionResult Secret()
        {
            return Ok("Apenas utilizadores com token veem isto 🛡️");
        }
    }
}