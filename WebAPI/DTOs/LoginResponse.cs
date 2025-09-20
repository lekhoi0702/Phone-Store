public class UserResponseDTO
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; }
    public string DefaultAddress { get; set; }
    public string Ward { get; set; }
    public string District { get; set; }
    public string Provine { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime LastLoginAt { get; set; }
    public string AccessToken { get; set; }
    public DateTime ExprireAt { get; set; }
}