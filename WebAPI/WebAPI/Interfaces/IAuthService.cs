using Microsoft.AspNetCore.Identity.Data;
using WebAPI.DTOs;

namespace WebAPI.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponseDTO<LoginResponseDTO>> LoginAsync(LoginRequestDTO loginRequest);
        Task<ApiResponseDTO<RegisterResponseDTO>> RegisterAccountAsync(
            RegisterRequestDTO registerRequest,
            int? adminUserId
        );
    }
}
