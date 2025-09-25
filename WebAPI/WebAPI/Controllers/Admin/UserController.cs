using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

[ApiController]
[Route("api/admin/[controller]")]
public class UserController : ControllerBase
{
    private readonly PhoneStoreDbContext _context;

    public UserController(PhoneStoreDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetUserList()
    {
        try
        {
            var users = _context.Users.ToList();
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet("userId={id}")]
    public IActionResult GetUserById(int id)
    {
        try
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost("create")]
    public IActionResult CreateUser(User user, int roleId)
    {
        try
        {
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Add(user);
            _context.SaveChanges();
            return CreatedAtAction(nameof(User), new { id = user.UserId });
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut("update/userId={id}")]
    public IActionResult UpdateUser(User user, int id)
    {
        try
        {
            if (user.UserId != id)
            {
                return BadRequest("Tài khoản không hợp lệ");
            }
            var existingUser = _context.Users.Find(id);
            if (existingUser == null)
            {
                return NotFound("Không tìm thấy tài khoản");
            }
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.DateOfBirth = user.DateOfBirth;
            existingUser.Gender = user.Gender;
            existingUser.DefaultAddress = user.DefaultAddress;
            existingUser.Ward = user.Ward;
            existingUser.District = user.District;
            existingUser.Province = user.Province;
            existingUser.IsActive = user.IsActive;
            _context.Update(existingUser);
            _context.SaveChanges();
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
