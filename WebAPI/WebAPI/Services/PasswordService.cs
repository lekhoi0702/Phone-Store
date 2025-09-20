using WebAPI.Interfaces;

namespace WebAPI.Services
{
    public class PasswordService : IPasswordService
    {
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hashedPasswrod)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPasswrod);
        }
    }
}
