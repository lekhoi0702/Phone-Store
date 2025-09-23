using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Antiforgery;

namespace WebAPI.DTOs;

public class RegisterRequestDTO
{
    [Required(ErrorMessage = "Không được để trống trường này")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Không được để trống trường này")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Không được để trống trường này")]
    [Compare("Password", ErrorMessage = "Mật khẩu xác thực không chính xác")]
    public string ConfirmPassword { get; set; }

    [Required(ErrorMessage = "Không được để trống trường này")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Không được để trống trường này")]
    public string LastName { get; set; }

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? PhoneNumber { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? DefaultAddress { get; set; }
    public string? Ward { get; set; }
    public string? District { get; set; }
    public string? Province { get; set; }
    public int RoleId { get; set; }
}
