using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebAPI.DTOs;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            _logger.LogInformation("=== LOGIN REQUEST START ===");
            _logger.LogInformation("Email: {Email}", loginRequestDTO.Email);
            _logger.LogInformation("Request Time: {Time}", DateTime.Now);

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Model validation failed");
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

            _logger.LogInformation("Login result - Success: {Success}", result.Success);

            if (result.Success)
            {
                _logger.LogInformation("=== LOGIN SUCCESS ===");
                _logger.LogInformation("User ID: {UserId}", result.Data?.UserId);
                _logger.LogInformation("Email: {Email}", result.Data?.Email);
                _logger.LogInformation("Role ID: {RoleId}", result.Data?.roleId);
                _logger.LogInformation("Token: {Token}", result.Data?.Token);
                _logger.LogInformation("Expires At: {ExpiresAt}", result.Data?.ExpiresAt);
                _logger.LogInformation("=== LOGIN RESPONSE END ===");

                return Ok(result);
            }

            _logger.LogWarning("Login failed - Message: {Message}", result.Message);
            _logger.LogWarning(
                "Login failed - Errors: {Errors}",
                string.Join(", ", result.Error ?? new List<string>())
            );

            return Unauthorized(result);
        }

        [HttpPost("register/customer")]
        public async Task<IActionResult> RegisterCustomer(
            [FromBody] RegisterRequestDTO registerRequestDTO
        )
        {
            _logger.LogInformation("=== REGISTER CUSTOMER REQUEST ===");
            _logger.LogInformation("Email: {Email}", registerRequestDTO.Email);

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Customer registration model validation failed");
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
            var result = await _authService.RegisterCustomerAsync(registerRequestDTO);
            if (result.Success)
            {
                _logger.LogInformation(
                    "Customer registration successful - User ID: {UserId}",
                    result.Data?.UserId
                );
                return Ok(result);
            }
            _logger.LogWarning("Customer registration failed - {Message}", result.Message);
            return BadRequest(result);
        }

        [HttpPost("register/staff")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> RegisterStaff(
            [FromBody] RegisterRequestDTO registerRequestDTO
        )
        {
            _logger.LogInformation("=== REGISTER STAFF REQUEST START ===");
            _logger.LogInformation("Request Time: {Time}", DateTime.Now);

            // Log current user claims
            var userIdClaim = User.FindFirst("UserId");
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            var roleIdClaim = User.FindFirst("RoleId");

            _logger.LogInformation("Current User Claims:");
            _logger.LogInformation("- UserId Claim: {UserIdClaim}", userIdClaim?.Value);
            _logger.LogInformation("- Role Claim: {RoleClaim}", roleClaim?.Value);
            _logger.LogInformation("- RoleId Claim: {RoleIdClaim}", roleIdClaim?.Value);
            _logger.LogInformation(
                "- All Claims: {Claims}",
                string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"))
            );

            // Log received data
            _logger.LogInformation("Received RegisterRequestDTO:");
            _logger.LogInformation("- Email: {Email}", registerRequestDTO.Email);
            _logger.LogInformation("- FirstName: {FirstName}", registerRequestDTO.FirstName);
            _logger.LogInformation("- LastName: {LastName}", registerRequestDTO.LastName);
            _logger.LogInformation("- PhoneNumber: {PhoneNumber}", registerRequestDTO.PhoneNumber);
            _logger.LogInformation("- RoleId: {RoleId}", registerRequestDTO.RoleId);
            _logger.LogInformation(
                "- Password: {PasswordPresent}",
                !string.IsNullOrEmpty(registerRequestDTO.Password)
            );
            _logger.LogInformation(
                "- ConfirmPassword: {ConfirmPasswordPresent}",
                !string.IsNullOrEmpty(registerRequestDTO.ConfirmPassword)
            );

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int adminUserId))
            {
                _logger.LogError("Cannot identify user from token");
                return Unauthorized(
                    new { success = false, message = "Không xác định được người dùng" }
                );
            }

            _logger.LogInformation("Admin User ID: {AdminUserId}", adminUserId);

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Staff registration model validation failed");
                _logger.LogWarning(
                    "ModelState errors: {Errors}",
                    string.Join(
                        ", ",
                        ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage)
                    )
                );

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

            var result = await _authService.RegisterStaffAsync(registerRequestDTO, adminUserId);

            _logger.LogInformation(
                "Staff registration result - Success: {Success}",
                result.Success
            );

            if (result.Success)
            {
                _logger.LogInformation("=== STAFF REGISTRATION SUCCESS ===");
                _logger.LogInformation("New Staff User ID: {UserId}", result.Data?.UserId);
                _logger.LogInformation("Staff Email: {Email}", registerRequestDTO.Email);
                _logger.LogInformation("Staff Role ID: {RoleId}", result.Data?.RoleId);
                _logger.LogInformation("=== STAFF REGISTRATION END ===");

                return Ok(result);
            }

            _logger.LogWarning("Staff registration failed - Message: {Message}", result.Message);
            _logger.LogWarning(
                "Staff registration failed - Errors: {Errors}",
                string.Join(", ", result.Error ?? new List<string>())
            );

            return BadRequest(result);
        }
    }
}
