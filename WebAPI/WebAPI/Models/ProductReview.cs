using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class ProductReview
{
    public int ReviewId { get; set; }

    public int ProductId { get; set; }

    public int UserId { get; set; }

    public int? OrderId { get; set; }

    public int Rating { get; set; }

    public string? Title { get; set; }

    public string? ReviewText { get; set; }

    public int HelpfulCount { get; set; }

    public bool IsVerifiedPurchase { get; set; }

    public bool IsApproved { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
