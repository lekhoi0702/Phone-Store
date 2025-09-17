using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class UserAddress
{
    public int AddressId { get; set; }

    public int UserId { get; set; }

    public string AddressType { get; set; } = null!;

    public string RecipientName { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string AddressLine { get; set; } = null!;

    public string Ward { get; set; } = null!;

    public string District { get; set; } = null!;

    public string Province { get; set; } = null!;

    public string? PostalCode { get; set; }

    public bool IsDefault { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
