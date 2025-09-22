using Microsoft.EntityFrameworkCore;
using WebAPI.DTOs;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly PhoneStoreDbContext _context;
        private readonly IPasswordService _passwordService;
        private readonly ITokenService _tokenService;

        public AuthService(
            PhoneStoreDbContext context,
            IPasswordService passwordService,
            ITokenService tokenService
        )
        {
            _context = context;
            _passwordService = passwordService;
            _tokenService = tokenService;
        }

        public async Task<ApiResponseDTO<LoginResponseDTO>> LoginAsync(LoginRequestDTO loginRequest)
        {
            try
            { //CHECK MAIL
                if (!IsValidEmail(loginRequest.Email))
                {
                    return new ApiResponseDTO<LoginResponseDTO>
                    {
                        Success = false,
                        Error = new List<string> { "Email không tồn tại" },
                        Message = "Email không tồn tại",
                    };
                }
                // CHECK USER IN DB
                var user = await _context
                    .Users.Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

                if (user == null)
                {
                    return new ApiResponseDTO<LoginResponseDTO>
                    {
                        Success = false,
                        Message = "Đăng nhập thất bại",
                        Error = new List<string> { "Tài khoản hoặc mật khẩu không chính xác" },
                    };
                }
                // CHECK ACCOUNT STATUS
                if (!user.IsActive)
                {
                    return new ApiResponseDTO<LoginResponseDTO>
                    {
                        Success = false,
                        Message = "Lỗi tài khoản",
                        Error = new List<string> { "Tài khoản không hoạt động" },
                    };
                }

                // CHECK VERIFIY EMAIL

                // CHECK VERIFY PASSWORD

                if (!_passwordService.VerifyPassword(loginRequest.Password, user.PasswordHash))
                {
                    return new ApiResponseDTO<LoginResponseDTO>
                    {
                        Success = false,
                        Message = "Lỗi đăng nhập",
                        Error = new List<string> { "Tài khoản hoặc mật khẩu không chính xác" },
                    };
                }
                // GENERATE TOKEN
                var token = _tokenService.GenerateToken(user);
                var expiresAt = DateTime.Now.AddMinutes(60);
                //UPDATE LAST LOGIN
                user.LastLoginAt = DateTime.Now;
                await _context.SaveChangesAsync();

                //CREATE RESPONSE
                var response = new LoginResponseDTO
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Gender = user.Gender,
                    DefaultAddress = user.DefaultAddress,
                    Ward = user.Ward,
                    District = user.District,
                    Provine = user.Province,
                };
                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = true,
                    Message = "Đăng nhập thành công",
                    Data = response,
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = false,
                    Error = new List<string> { ex.Message },
                    Message = "Lỗi đăng nhập",
                };
            }
        }

        public async Task<ApiResponseDTO<LoginResponseDTO>> CreateStaffRequest(
            CreateStaffRequestDTO createStaffRequestDTO
        )
        {
            try
            {
                //CHECK MAIL
                if (!IsValidEmail(createStaffRequestDTO.Email))
                {
                    return ApiResponseDTO<LoginResponseDTO>
                    { 
                        Success = false,
                    Error = new List<string> { ex.Message },
                    Message = "Lỗi đăng ký",
                    }
                 }
                //CHECK USER IN DATABASE
                //CHECK VERIFY EMAIL
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = false,
                    Error = new List<string> { ex.Message },
                    Message = "Lỗi đăng ký",
                };
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
