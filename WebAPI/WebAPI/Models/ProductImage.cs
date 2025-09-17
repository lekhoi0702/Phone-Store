using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class ProductImage
{
    public int ImageId { get; set; }

    public int ProductId { get; set; }

    public int? VariantId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public string? ImageAlt { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsMainImage { get; set; }

    public string ImageType { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual ProductVariant? Variant { get; set; }
}
