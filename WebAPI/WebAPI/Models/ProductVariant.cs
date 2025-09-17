using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class ProductVariant
{
    public int VariantId { get; set; }

    public int ProductId { get; set; }

    public string VariantName { get; set; } = null!;

    public string Sku { get; set; } = null!;

    public string? Color { get; set; }

    public int? StorageCapacity { get; set; }

    public decimal OriginalPrice { get; set; }

    public decimal SalePrice { get; set; }

    public int StockQuantity { get; set; }

    public int MinStockLevel { get; set; }

    public decimal? Weight { get; set; }

    public string? Dimensions { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Product Product { get; set; } = null!;

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
}
