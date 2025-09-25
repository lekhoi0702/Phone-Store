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
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            PhoneStoreDbContext context,
            IPasswordService passwordService,
            ITokenService tokenService,
            ILogger<AuthService> logger
        )
        {
            _context = context;
            _passwordService = passwordService;
            _tokenService = tokenService;
            _logger = logger;
        }

        public async Task<ApiResponseDTO<LoginResponseDTO>> LoginAsync(LoginRequestDTO loginRequest)
        {
            try
            {
                _logger.LogInformation("=== AUTH SERVICE LOGIN START ===");
                _logger.LogInformation("Login attempt for email: {Email}", loginRequest.Email);

                //CHECK MAIL
                if (!IsValidEmail(loginRequest.Email))
                {
                    _logger.LogWarning("Invalid email format: {Email}", loginRequest.Email);
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

                _logger.LogInformation("User found in database: {UserFound}", user != null);
                if (user != null)
                {
                    _logger.LogInformation(
                        "User details - ID: {UserId}, RoleId: {RoleId}, IsActive: {IsActive}",
                        user.UserId,
                        user.RoleId,
                        user.IsActive
                    );
                }

                if (user == null)
                {
                    _logger.LogWarning("User not found for email: {Email}", loginRequest.Email);
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
                    _logger.LogWarning("Account is inactive for user: {UserId}", user.UserId);
                    return new ApiResponseDTO<LoginResponseDTO>
                    {
                        Success = false,
                        Message = "Lỗi tài khoản",
                        Error = new List<string> { "Tài khoản không hoạt động" },
                    };
                }

                // CHECK VERIFY PASSWORD
                var passwordValid = _passwordService.VerifyPassword(
                    loginRequest.Password,
                    user.PasswordHash
                );
                _logger.LogInformation(
                    "Password verification result: {PasswordValid}",
                    passwordValid
                );

                if (!passwordValid)
                {
                    _logger.LogWarning("Invalid password for user: {UserId}", user.UserId);
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

                _logger.LogInformation("Token generated successfully");
                _logger.LogInformation("Token expires at: {ExpiresAt}", expiresAt);

                //UPDATE LAST LOGIN
                user.LastLoginAt = DateTime.Now;
                await _context.SaveChangesAsync();
                _logger.LogInformation("Last login time updated");

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
                    roleId = user.RoleId,
                    Token = token,
                    ExpiresAt = expiresAt,
                };

                _logger.LogInformation("=== AUTH SERVICE LOGIN SUCCESS ===");
                _logger.LogInformation("Response created for user: {UserId}", response.UserId);

                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = true,
                    Message = "Đăng nhập thành công",
                    Data = response,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Exception occurred during login for email: {Email}",
                    loginRequest.Email
                );
                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = false,
                    Error = new List<string> { ex.Message },
                    Message = "Lỗi đăng nhập",
                };
            }
        }

        //REGISTER CUSTOMER
        //-check existing email
        //check existing phone number
        //hash password
        //create email verification token
        //create user with roleid = 2 (customer), roleid = 3(staff)
        //send verification mail
        //create response
        public async Task<ApiResponseDTO<RegisterResponseDTO>> RegisterCustomerAsync(
            RegisterRequestDTO registerRequestDTO
        )
        {
            try
            {
                _logger.LogInformation("=== AUTH SERVICE REGISTER CUSTOMER START ===");
                _logger.LogInformation(
                    "Registering customer with email: {Email}",
                    registerRequestDTO.Email
                );

                if (!IsExistingEmail(registerRequestDTO.Email))
                {
                    _logger.LogWarning("Email already exists: {Email}", registerRequestDTO.Email);
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Đăng ký thất bại",
                        Error = new List<string> { "Email đã được sử dụng" },
                    };
                }
                ;
                if (!IsExistingPhoneNumber(registerRequestDTO.PhoneNumber))
                {
                    _logger.LogWarning(
                        "Phone number already exists: {PhoneNumber}",
                        registerRequestDTO.PhoneNumber
                    );
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Đăng ký thất bại",
                        Error = new List<string> { "Số điện thoại đã được sử dụng" },
                    };
                }
                var passwordHash = _passwordService.HashPassword(registerRequestDTO.Password);

                var emailVerificationToken = Guid.NewGuid().ToString();

                var newUser = new User
                {
                    Email = registerRequestDTO.Email.ToLower().Trim(),
                    PasswordHash = passwordHash.Trim(),
                    FirstName = registerRequestDTO.FirstName.ToLower().Trim(),
                    LastName = registerRequestDTO.LastName.ToLower().Trim(),
                    PhoneNumber = registerRequestDTO.PhoneNumber.ToLower().Trim(),
                    DateOfBirth = registerRequestDTO.DateOfBirth,
                    Gender = registerRequestDTO.Gender.Trim(),
                    DefaultAddress = registerRequestDTO.DefaultAddress.ToLower().Trim(),
                    Ward = registerRequestDTO.Ward.ToLower().Trim(),
                    District = registerRequestDTO.District.ToLower().Trim(),
                    Province = registerRequestDTO.Province.ToLower().Trim(),
                    RoleId = 2,
                    IsActive = true,
                    EmailVerificationToken = emailVerificationToken,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                _logger.LogInformation(
                    "Customer registered successfully - User ID: {UserId}",
                    newUser.UserId
                );

                var response = new RegisterResponseDTO
                {
                    UserId = newUser.UserId,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName,
                    PhoneNumber = newUser.PhoneNumber,
                    RoleId = newUser.RoleId,
                    IsEmailVerified = newUser.IsEmailVerified,
                    CreatedAt = newUser.CreatedAt,
                };
                _logger.LogInformation("=== AUTH SERVICE REGISTER CUSTOMER SUCCESS ===");
                return new ApiResponseDTO<RegisterResponseDTO>
                {
                    Success = true,
                    Message = "Đăng ký thành công",
                    Data = response,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Exception occurred during customer registration for email: {Email}",
                    registerRequestDTO.Email
                );
                return new ApiResponseDTO<RegisterResponseDTO>
                {
                    Success = false,
                    Message = "Lỗi đăng ký tài khoản",
                    Error = new List<string> { ex.Message },
                };
            }
        }

        //REGISTER STAFF
        //check admin role

        public async Task<ApiResponseDTO<RegisterResponseDTO>> RegisterStaffAsync(
            RegisterRequestDTO registerRequestDTO,
            int adminUserId
        )
        {
            try
            {
                _logger.LogInformation("=== AUTH SERVICE REGISTER STAFF START ===");
                _logger.LogInformation(
                    "Registering staff with email: {Email}",
                    registerRequestDTO.Email
                );

                var admin = await _context.Users.FirstOrDefaultAsync(x => x.UserId == adminUserId);
                if (admin == null || admin.RoleId != 1)
                {
                    _logger.LogWarning(
                        "Admin user not found or not an admin: {AdminUserId}",
                        adminUserId
                    );
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Đăng ký thất bại",
                        Error = new List<string>
                        {
                            "Chỉ ADMIN mới có quyền tạo tài khoản nhân viên",
                        },
                    };
                }
                if (!IsExistingEmail(registerRequestDTO.Email))
                {
                    _logger.LogWarning("Email already exists: {Email}", registerRequestDTO.Email);
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Đăng ký thất bại",
                        Error = new List<string> { "Email đã được sử dụng" },
                    };
                }
                ;
                if (!IsExistingPhoneNumber(registerRequestDTO.PhoneNumber))
                {
                    _logger.LogWarning(
                        "Phone number already exists: {PhoneNumber}",
                        registerRequestDTO.PhoneNumber
                    );
                    return new ApiResponseDTO<RegisterResponseDTO>
                    {
                        Success = false,
                        Message = "Đăng ký thất bại",
                        Error = new List<string> { "Số điện thoại đã được sử dụng" },
                    };
                }
                var passwordHash = _passwordService.HashPassword(registerRequestDTO.Password);

                var emailVerificationToken = Guid.NewGuid().ToString();

                var newUser = new User
                {
                    Email = registerRequestDTO.Email.ToLower().Trim(),
                    PasswordHash = passwordHash.Trim(),
                    FirstName = registerRequestDTO.FirstName.ToLower().Trim(),
                    LastName = registerRequestDTO.LastName.ToLower().Trim(),
                    PhoneNumber = registerRequestDTO.PhoneNumber.ToLower().Trim(),
                    DateOfBirth = registerRequestDTO.DateOfBirth,
                    RoleId = 3,
                    IsActive = true,
                    IsEmailVerified = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                _logger.LogInformation(
                    "Staff registered successfully - User ID: {UserId}",
                    newUser.UserId
                );

                var response = new RegisterResponseDTO
                {
                    UserId = newUser.UserId,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName,
                    PhoneNumber = newUser.PhoneNumber,
                    RoleId = newUser.RoleId,
                    CreatedAt = newUser.CreatedAt,
                };
                _logger.LogInformation("=== AUTH SERVICE REGISTER STAFF SUCCESS ===");
                return new ApiResponseDTO<RegisterResponseDTO>
                {
                    Success = true,
                    Message = "Đăng ký thành công",
                    Data = response,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Exception occurred during staff registration for email: {Email}",
                    registerRequestDTO.Email
                );
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
                _logger.LogError(
                    ex,
                    "Exception occurred while checking existing email: {Email}",
                    email
                );
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
                _logger.LogError(
                    ex,
                    "Exception occurred while checking existing phone number: {PhoneNumber}",
                    phoneNumber
                );
                return false;
            }
        }
    }
}
