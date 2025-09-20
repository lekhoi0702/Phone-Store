
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

[ApiController]
[Route("api/[controller]")]

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
    [HttpGet("{id}")]
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

    [HttpPost]
    public IActionResult CreateUser(User user)
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

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, User user)
    {
        try
        {
            if (user == null || user.UserId != id)
            {
                return BadRequest();
            }
            var existingUser = _context.Users.Find(id);
            if (existingUser == null)
            {
                return NotFound();
            }
            


        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}