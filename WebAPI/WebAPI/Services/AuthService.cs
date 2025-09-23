using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
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

        //REGISTER CUSTOMER
        public async Task<ApiResponseDTO<RegisterResponseDTO>> RegisterAccountAsync(
            RegisterRequestDTO registerRequestDTO,
            int? adminUserId
        )
        {
            try
            {
                //CHECK ADMIN IF CREATE STAFF ACCOUNT
                var admin = _context.Users.FirstOrDefault(x => x.UserId == adminUserId);
                if (admin == null || admin.RoleId != 1)
                {
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Lỗi đăng ký",
                        Error = new List<string>
                        {
                            "Chỉ admin mới được quyền tạo tài khoản nhân viên",
                        },
                    };
                }

                //CHECK EXISTING EMAIL
                if (!IsExistingEmail(registerRequestDTO.Email))
                {
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Lỗi Email",
                        Error = new List<string> { "Email đã tồn tại" },
                    };
                }
                //CHECK EXISTING PHONENUMBER
                if (!IsExistingPhoneNumber(registerRequestDTO.PhoneNumber))
                {
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Lỗi Số điện thoại",
                        Error = new List<string> { "Số điện thoại đã tồn tại" },
                    };
                }
                //HASH PASSWORD
                var password = _passwordService.HashPassword(registerRequestDTO.ConfirmPassword);

                //CREATE NEW USER WITH ROLEID = 3
                var newUser = new User
                {
                    Email = registerRequestDTO.Email,
                    PasswordHash = password,
                    FirstName = registerRequestDTO.FirstName,
                    LastName = registerRequestDTO.LastName,
                    PhoneNumber = registerRequestDTO.PhoneNumber,
                    DateOfBirth = registerRequestDTO.DateOfBirth,
                    DefaultAddress = registerRequestDTO.DefaultAddress,
                    Ward = registerRequestDTO.Ward,
                    District = registerRequestDTO.District,
                    Province = registerRequestDTO.Province,
                    RoleId = registerRequestDTO.RoleId,
                    IsActive = true,
                    IsEmailVerified = false,
                    EmailVerificationToken = Guid.NewGuid().ToString(),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                var response = new RegisterResponseDTO
                {
                    UserId = newUser.UserId,
                    Email = newUser.Email,
                    PhoneNumber = newUser.PhoneNumber,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName,
                    RoleId = newUser.RoleId,
                    IsEmailVerified = newUser.IsEmailVerified,
                    CreatedAt = newUser.CreatedAt,
                };
                return new ApiResponseDTO<RegisterResponseDTO>
                {
                    Success = true,
                    Message = "Đăng ký thành công",
                    Data = response,
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegisterResponseDTO>
                {
                    Success = false,
                    Message = "Lỗi đăng ký tài khoản",
                    Error = new List<string> { ex.Message },
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

        private bool IsExistingEmail(string email)
        {
            try
            {
                var result = _context.Users.FirstOrDefault(x => x.Email == email);
                return result == null;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private bool IsExistingPhoneNumber(string phoneNumber)
        {
            try
            {
                var result = _context.Users.FirstOrDefault(x => x.PhoneNumber == phoneNumber);
                return result == null;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
