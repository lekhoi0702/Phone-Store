using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new
                    {
                        success = false,
                        message = "Dữ liệu đầu vào không chính xác",
                        error = ModelState
                            .Values.SelectMany(x => x.Errors)
                            .Select(x => x.ErrorMessage)
                            .ToList(),
                    }
                );
            }
            var result = await _authService.LoginAsync(loginRequestDTO);
            if (result.Success)
            {
                return Ok(result);
            }
            return Unauthorized(result);
        }
    }
}
