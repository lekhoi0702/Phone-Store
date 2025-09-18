using Microsoft.AspNetCore.Mvc;
using System;
using WebAPI.Models;

/// <summary>
/// Summary description for Class1
/// </summary>
/// 
[ApiController]
[Route("api/[controller]")]
public class BrandController : ControllerBase
{
	private readonly PhoneStoreDbContext _context;
	public BrandController(PhoneStoreDbContext context) => _context = context;

	[HttpGet]
	public IActionResult GetBrands()
	{
		try
		{
			var brands = _context.Brands.ToList();
			return Ok(brands);
		}
		catch (Exception ex)
		{
			return StatusCode(500, $"Internal server error: {ex.Message}");
		}
	}

	[HttpGet("{id}")]
	public IActionResult GetBrand(int id)
	{
		try
		{
			var brand = _context.Brands.Find(id);
			if (brand == null)
			{
				return NotFound($"Brand with ID {id} not found.");
			}
			return Ok(brand);
		}
		catch (Exception ex)
		{
			return StatusCode(500, $"Internal server error: {ex.Message}");
		}
	}

	[HttpPost]
	public IActionResult CreateBrand(Brand brand)
	{
		try
		{
			if (brand == null)
			{
				return BadRequest("Brand object is null.");
			}
			_context.Brands.Add(brand);
			_context.SaveChanges();
			return CreatedAtAction(nameof(GetBrand), new { id = brand.BrandId }, brand);
		}
		catch (Exception ex)
		{
			return StatusCode(500, $"Internal server error: {ex.Message}");
		}
    }
	[HttpPut("{id}")]
	public IActionResult UpdateBrand(int id, Brand brand)
	{
		try
		{
			if (brand == null || brand.BrandId != id)
			{
				return BadRequest("Brand object is null or ID mismatch.");
			}
			var existingBrand = _context.Brands.Find(id);
			if (existingBrand == null)
			{
				return NotFound($"Brand with ID {id} not found.");
			}
			existingBrand.BrandName = brand.BrandName;
			existingBrand.BrandLogo = brand.BrandLogo;
			existingBrand.Description = brand.Description;
			existingBrand.IsActive = brand.IsActive;
			existingBrand.UpdatedAt = DateTime.Now;
			_context.Brands.Update(existingBrand);
			_context.SaveChanges();
			return NoContent();
		}
		catch (Exception ex)
		{
			return StatusCode(500, $"Internal server error: {ex.Message}");
		}
    }

	[HttpDelete("{id}")]
	public IActionResult DeleteBrand(int id) {
		try
		{
			var brand = _context.Brands.Find(id);
            if
				(brand == null)
            {
				return NotFound($"Brand with ID {id} not found.");
            }
			_context.Brands.Remove(brand);
			_context.SaveChanges();
			return NoContent();
			}
		catch (Exception ex)
		{
			return StatusCode(500, $"Internal server error: {ex.Message}");
		}
	}

}