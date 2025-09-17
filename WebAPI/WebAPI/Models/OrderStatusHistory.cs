using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class OrderStatusHistory
{
    public int HistoryId { get; set; }

    public int OrderId { get; set; }

    public int StatusId { get; set; }

    public int? ChangedBy { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User? ChangedByNavigation { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual OrderStatus Status { get; set; } = null!;
}
