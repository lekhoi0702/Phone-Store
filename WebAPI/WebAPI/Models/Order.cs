using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public string OrderNumber { get; set; } = null!;

    public int UserId { get; set; }

    public int StatusId { get; set; }

    public string ShippingName { get; set; } = null!;

    public string ShippingPhone { get; set; } = null!;

    public string ShippingAddress { get; set; } = null!;

    public string ShippingWard { get; set; } = null!;

    public string ShippingDistrict { get; set; } = null!;

    public string ShippingProvince { get; set; } = null!;

    public decimal SubTotal { get; set; }

    public decimal ShippingFee { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public string? Notes { get; set; }

    public string? AdminNotes { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public virtual ICollection<CouponUsage> CouponUsages { get; set; } = new List<CouponUsage>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<OrderStatusHistory> OrderStatusHistories { get; set; } = new List<OrderStatusHistory>();

    public virtual ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();

    public virtual OrderStatus Status { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
