using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ITokenService
    {
        public string GenerateToken(User user);
    }
}