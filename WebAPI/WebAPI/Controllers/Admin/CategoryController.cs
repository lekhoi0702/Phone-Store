using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

[ApiController]
[Route("api/[controller]")]

public class CategoryController : ControllerBase
{
    private readonly PhoneStoreDbContext _context;

    public CategoryController(PhoneStoreDbContext context) => _context = context;
    [HttpGet]

    public IActionResult GetCategories()
    {
        try

        {
            var categories = _context.Categories.ToList();
            return Ok(categories);

        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
    [HttpGet("{id}")]
    public IActionResult GetCategory(int id)
    {
        try
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound($"Không tìm thấy Category {id}");
            }
            return Ok(category);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
    [HttpPost]
    public IActionResult CreateCategory(Category category)
    {
        try
        {
            if (category == null)
            {
                return BadRequest();
            }
            _context.Categories.Add(category);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, category);

        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    // public IActionResult UpdateCategory(int id, Category category)
    // { 
        
    // }

    

  



}

