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

    [HttpPut("{id}")]
    public IActionResult UpdateCategory(int id, Category category)
    {
        try
        {
            if (category == null || category.CategoryId != id)
            {
                return BadRequest();
            }
            var existingCategory = _context.Categories.Find(id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            existingCategory.CategoryName = category.CategoryName;
            existingCategory.Description = category.Description;
            existingCategory.IsActive = category.IsActive;
            existingCategory.UpdatedAt = DateTime.Now;
            _context.Update(existingCategory);
            _context.SaveChanges();
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(int id)
    {
        try
        {
            var existingCategory = _context.Categories.Find(id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            _context.Categories.Remove(existingCategory);
            _context.SaveChanges();
            return NoContent();
        }
        catch (Exception e) { return StatusCode(500, e.Message); }
    }

}

