using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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

        [HttpPost("register-account")]
        public async Task<IActionResult> RegisterAccount(
            [FromBody] RegisterRequestDTO registerRequestDTO
        )
        {
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int adminUserId))
            {
                return Unauthorized(
                    new { success = false, message = "Không xác định được người dùng" }
                );
            }
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
            var result = await _authService.RegisterAccountAsync(registerRequestDTO, adminUserId);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
