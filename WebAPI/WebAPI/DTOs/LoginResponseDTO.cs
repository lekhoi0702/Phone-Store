namespace WebAPI.DTOs
{
    public class LoginResponseDTO
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Gender { get; set; }
        public string? DefaultAddress { get; set; }
        public string? Ward { get; set; }
        public string? District { get; set; }
        public string? Provine { get; set; }
        public string? Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public int roleId { get; set; }
    }
}
