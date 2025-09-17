using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public string ProductCode { get; set; } = null!;

    public int BrandId { get; set; }

    public int CategoryId { get; set; }

    public string? OperatingSystem { get; set; }

    public decimal? ScreenSize { get; set; }

    public string? Resolution { get; set; }

    public string? ChipSet { get; set; }

    public int? Ram { get; set; }

    public int? Storage { get; set; }

    public int? BatteryCapacity { get; set; }

    public string? Description { get; set; }

    public string? ShortDescription { get; set; }

    public bool IsActive { get; set; }

    public bool IsDiscontinued { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();

    public virtual ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
}
