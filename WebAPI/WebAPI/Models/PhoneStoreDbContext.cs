using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models;

public partial class PhoneStoreDbContext : DbContext
{
    public PhoneStoreDbContext() { }

    public PhoneStoreDbContext(DbContextOptions<PhoneStoreDbContext> options)
        : base(options) { }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Coupon> Coupons { get; set; }

    public virtual DbSet<CouponUsage> CouponUsages { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

    public virtual DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductReview> ProductReviews { get; set; }

    public virtual DbSet<ProductVariant> ProductVariants { get; set; }

    public virtual DbSet<ShoppingCart> ShoppingCarts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserAddress> UserAddresses { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        =>
        optionsBuilder.UseSqlServer(
            "Server=DTJHV1130;Database=PhoneStoreDB;Trusted_Connection=True;TrustServerCertificate=True;"
        );

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("PK__Brands__DAD4F05E8EB40C7E");

            entity.HasIndex(e => e.BrandName, "UQ__Brands__2206CE9B6690677A").IsUnique();

            entity.Property(e => e.BrandLogo).HasMaxLength(500);
            entity.Property(e => e.BrandName).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartItemId).HasName("PK__CartItem__488B0B0ABD418E21");

            entity
                .HasIndex(e => new { e.CartId, e.VariantId }, "UQ_CartItems_CartVariant")
                .IsUnique();

            entity.Property(e => e.AddedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Quantity).HasDefaultValue(1);
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity
                .HasOne(d => d.Cart)
                .WithMany(p => p.CartItems)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CartItems_Carts");

            entity
                .HasOne(d => d.Variant)
                .WithMany(p => p.CartItems)
                .HasForeignKey(d => d.VariantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CartItems_Variants");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A0B2B4512BD");

            entity.HasIndex(e => e.CategoryName, "UQ__Categori__8517B2E05BEE4B6E").IsUnique();

            entity.Property(e => e.CategoryName).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.HasKey(e => e.CouponId).HasName("PK__Coupons__384AF1BA028CB956");

            entity.HasIndex(e => e.CouponCode, "UQ__Coupons__D34908000AF996E2").IsUnique();

            entity.Property(e => e.CouponCode).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.CouponName).HasMaxLength(200).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.DiscountType).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.DiscountValue).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MaxDiscountAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MinOrderAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<CouponUsage>(entity =>
        {
            entity.HasKey(e => e.UsageId).HasName("PK__CouponUs__29B1972033FD5964");

            entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UsedAt).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.Coupon)
                .WithMany(p => p.CouponUsages)
                .HasForeignKey(d => d.CouponId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CouponUsages_Coupons");

            entity
                .HasOne(d => d.Order)
                .WithMany(p => p.CouponUsages)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CouponUsages_Orders");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.CouponUsages)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CouponUsages_Users");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF750E9C6E");

            entity.HasIndex(e => e.CreatedAt, "IX_Orders_CreatedAt").IsDescending();

            entity.HasIndex(e => e.OrderNumber, "IX_Orders_OrderNumber");

            entity.HasIndex(e => e.StatusId, "IX_Orders_StatusId");

            entity.HasIndex(e => e.UserId, "IX_Orders_UserId");

            entity.HasIndex(e => e.OrderNumber, "UQ__Orders__CAC5E74367BFDC4C").IsUnique();

            entity.Property(e => e.AdminNotes).HasMaxLength(500).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Notes).HasMaxLength(500).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.OrderNumber).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.PaymentMethod).HasMaxLength(50).IsUnicode(false);
            entity
                .Property(e => e.PaymentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Pending");
            entity
                .Property(e => e.ShippingAddress)
                .HasMaxLength(500)
                .UseCollation("Vietnamese_CI_AS");
            entity
                .Property(e => e.ShippingDistrict)
                .HasMaxLength(100)
                .UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.ShippingFee).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ShippingName).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.ShippingPhone).HasMaxLength(15).IsUnicode(false);
            entity
                .Property(e => e.ShippingProvince)
                .HasMaxLength(100)
                .UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.ShippingWard).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.SubTotal).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.Status)
                .WithMany(p => p.Orders)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Orders_OrderStatuses");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Orders_Users");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("PK__OrderIte__57ED0681AA5B74B6");

            entity.Property(e => e.ProductName).HasMaxLength(200).UseCollation("Vietnamese_CI_AS");
            entity
                .Property(e => e.TotalPrice)
                .HasComputedColumnSql("([UnitPrice]*[Quantity])", true)
                .HasColumnType("decimal(29, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.VariantName).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");

            entity
                .HasOne(d => d.Order)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItems_Orders");

            entity
                .HasOne(d => d.Variant)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.VariantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItems_Variants");
        });

        modelBuilder.Entity<OrderStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__OrderSta__C8EE20636E7540D1");

            entity.HasIndex(e => e.StatusName, "UQ__OrderSta__05E7698A7E34CB59").IsUnique();

            entity.Property(e => e.Description).HasMaxLength(200).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.StatusName).HasMaxLength(50).UseCollation("Vietnamese_CI_AS");
        });

        modelBuilder.Entity<OrderStatusHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__OrderSta__4D7B4ABDD7DE2AEE");

            entity.ToTable("OrderStatusHistory");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Notes).HasMaxLength(500).UseCollation("Vietnamese_CI_AS");

            entity
                .HasOne(d => d.ChangedByNavigation)
                .WithMany(p => p.OrderStatusHistories)
                .HasForeignKey(d => d.ChangedBy)
                .HasConstraintName("FK_OrderStatusHistory_Users");

            entity
                .HasOne(d => d.Order)
                .WithMany(p => p.OrderStatusHistories)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderStatusHistory_Orders");

            entity
                .HasOne(d => d.Status)
                .WithMany(p => p.OrderStatusHistories)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderStatusHistory_OrderStatuses");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CD5AF66EA2");

            entity.HasIndex(e => e.BrandId, "IX_Products_BrandId");

            entity.HasIndex(e => e.CategoryId, "IX_Products_CategoryId");

            entity.HasIndex(e => e.CreatedAt, "IX_Products_CreatedAt").IsDescending();

            entity.HasIndex(e => e.IsActive, "IX_Products_IsActive");

            entity.HasIndex(e => e.ProductCode, "UQ__Products__2F4E024F5C781468").IsUnique();

            entity.Property(e => e.ChipSet).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity
                .Property(e => e.OperatingSystem)
                .HasMaxLength(50)
                .UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.ProductCode).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.ProductName).HasMaxLength(200).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.Ram).HasColumnName("RAM");
            entity.Property(e => e.Resolution).HasMaxLength(50);
            entity.Property(e => e.ScreenSize).HasColumnType("decimal(3, 1)");
            entity
                .Property(e => e.ShortDescription)
                .HasMaxLength(500)
                .UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.Brand)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Products_Brands");

            entity
                .HasOne(d => d.Category)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Products_Categories");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__ProductI__7516F70C8D7876AA");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ImageAlt).HasMaxLength(200).UseCollation("Vietnamese_CI_AS");
            entity
                .Property(e => e.ImageType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("product");
            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            entity
                .HasOne(d => d.Product)
                .WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductImages_Products");

            entity
                .HasOne(d => d.Variant)
                .WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.VariantId)
                .HasConstraintName("FK_ProductImages_Variants");
        });

        modelBuilder.Entity<ProductReview>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__ProductR__74BC79CE9BA1BAD9");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ReviewText).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.Title).HasMaxLength(200).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.Order)
                .WithMany(p => p.ProductReviews)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK_ProductReviews_Orders");

            entity
                .HasOne(d => d.Product)
                .WithMany(p => p.ProductReviews)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductReviews_Products");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.ProductReviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductReviews_Users");
        });

        modelBuilder.Entity<ProductVariant>(entity =>
        {
            entity.HasKey(e => e.VariantId).HasName("PK__ProductV__0EA23384B3102C25");

            entity.HasIndex(e => e.IsActive, "IX_ProductVariants_IsActive");

            entity.HasIndex(e => e.ProductId, "IX_ProductVariants_ProductId");

            entity.HasIndex(e => e.Sku, "IX_ProductVariants_SKU");

            entity
                .HasIndex(
                    e => new { e.ProductId, e.VariantName },
                    "UQ_ProductVariants_ProductVariant"
                )
                .IsUnique();

            entity.HasIndex(e => e.Sku, "UQ__ProductV__CA1ECF0DAC148F4C").IsUnique();

            entity.Property(e => e.Color).HasMaxLength(50).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Dimensions).HasMaxLength(50);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MinStockLevel).HasDefaultValue(5);
            entity.Property(e => e.OriginalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SalePrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Sku).HasMaxLength(100).IsUnicode(false).HasColumnName("SKU");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.VariantName).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.Weight).HasColumnType("decimal(8, 2)");

            entity
                .HasOne(d => d.Product)
                .WithMany(p => p.ProductVariants)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductVariants_Products");
        });

        modelBuilder.Entity<ShoppingCart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("PK__Shopping__51BCD7B701B309E1");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.ShoppingCarts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ShoppingCarts_Users");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C1D74BD5F");

            entity.HasIndex(e => e.Email, "IX_Users_Email");

            entity.HasIndex(e => e.IsActive, "IX_Users_IsActive");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534091A7B2F").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity
                .Property(e => e.DefaultAddress)
                .HasMaxLength(500)
                .UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.District).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.Email).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.EmailVerificationToken).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.FirstName).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");

            entity.Property(e => e.Gender).HasMaxLength(10).IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.LastName).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.PasswordHash).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.PasswordResetToken).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15).IsUnicode(false);
            entity.Property(e => e.Province).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.RoleId).HasDefaultValue(2);

            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Ward).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");

            entity
                .HasOne(d => d.Role)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_UserRoles");
        });

        modelBuilder.Entity<UserAddress>(entity =>
        {
            entity.HasKey(e => e.AddressId).HasName("PK__UserAddr__091C2AFB753473EF");

            entity.Property(e => e.AddressLine).HasMaxLength(500).UseCollation("Vietnamese_CI_AS");
            entity
                .Property(e => e.AddressType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("shipping");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.District).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.PhoneNumber).HasMaxLength(15).IsUnicode(false);
            entity.Property(e => e.PostalCode).HasMaxLength(10).IsUnicode(false);
            entity.Property(e => e.Province).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");
            entity
                .Property(e => e.RecipientName)
                .HasMaxLength(100)
                .UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.Ward).HasMaxLength(100).UseCollation("Vietnamese_CI_AS");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.UserAddresses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserAddresses_Users");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__UserRole__8AFACE1AD1285385");

            entity.HasIndex(e => e.RoleName, "UQ__UserRole__8A2B61606F2263B7").IsUnique();

            entity.Property(e => e.Description).HasMaxLength(200).UseCollation("Vietnamese_CI_AS");
            entity.Property(e => e.RoleName).HasMaxLength(50).UseCollation("Vietnamese_CI_AS");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
