-- =============================================
-- DATABASE DESIGN FOR PHONE STORE WEBSITE
-- Thiết kế Database cho Website bán điện thoại
-- =============================================

-- Drop database if exists and recreate
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'PhoneStoreDB')
BEGIN
    ALTER DATABASE PhoneStoreDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PhoneStoreDB;
END
GO

-- Tạo database
CREATE DATABASE PhoneStoreDB;
GO

USE PhoneStoreDB;
GO

-- Set proper options for computed columns
SET QUOTED_IDENTIFIER ON;
GO

-- =============================================
-- 1. BẢNG DANH MỤC VÀ PHÂN LOẠI
-- =============================================

-- Bảng hãng sản xuất
CREATE TABLE Brands (
    BrandId INT IDENTITY(1,1) PRIMARY KEY,
    BrandName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL UNIQUE,
    BrandLogo NVARCHAR(500) NULL, -- URL đến logo
    Description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Bảng danh mục sản phẩm (có thể mở rộng cho tablet, phụ kiện...)
CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL UNIQUE,
    Description NVARCHAR(500) COLLATE Vietnamese_CI_AS NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- =============================================
-- 2. BẢNG SẢN PHẨM CHÍNH
-- =============================================

-- Bảng sản phẩm chính
CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(200) COLLATE Vietnamese_CI_AS NOT NULL,
    ProductCode VARCHAR(50) NOT NULL UNIQUE, -- Mã sản phẩm duy nhất
    BrandId INT NOT NULL,
    CategoryId INT NOT NULL,
    
    -- Thông số kỹ thuật cơ bản
    OperatingSystem NVARCHAR(50) COLLATE Vietnamese_CI_AS NULL, -- iOS, Android
    ScreenSize DECIMAL(3,1) NULL, -- inch
    Resolution NVARCHAR(50) NULL, -- 1920x1080
    ChipSet NVARCHAR(100) COLLATE Vietnamese_CI_AS NULL, -- A15 Bionic, Snapdragon 888
    RAM INT NULL, -- GB
    Storage INT NULL, -- GB
    BatteryCapacity INT NULL, -- mAh
    
    -- Thông tin bán hàng
    Description NVARCHAR(MAX) COLLATE Vietnamese_CI_AS NULL,
    ShortDescription NVARCHAR(500) COLLATE Vietnamese_CI_AS NULL,
    
    -- Trạng thái
    IsActive BIT NOT NULL DEFAULT 1,
    IsDiscontinued BIT NOT NULL DEFAULT 0, -- Sản phẩm ngừng bán
    
    -- Audit fields
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    
    -- Foreign Keys
    CONSTRAINT FK_Products_Brands FOREIGN KEY (BrandId) REFERENCES Brands(BrandId),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);

-- Bảng biến thể sản phẩm (màu sắc, dung lượng)
CREATE TABLE ProductVariants (
    VariantId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    VariantName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL, -- iPhone 14 Pro 128GB - Vàng
    SKU VARCHAR(100) NOT NULL UNIQUE, -- Stock Keeping Unit
    
    -- Thuộc tính biến thể
    Color NVARCHAR(50) COLLATE Vietnamese_CI_AS NULL,
    StorageCapacity INT NULL, -- GB
    
    -- Giá và tồn kho
    OriginalPrice DECIMAL(18,2) NOT NULL,
    SalePrice DECIMAL(18,2) NOT NULL, -- Giá bán hiện tại
    StockQuantity INT NOT NULL DEFAULT 0,
    MinStockLevel INT NOT NULL DEFAULT 5, -- Mức tồn kho tối thiểu
    
    -- Thông tin bổ sung
    Weight DECIMAL(8,2) NULL, -- gram
    Dimensions NVARCHAR(50) NULL, -- 146.7 x 71.5 x 7.65 mm
    
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_ProductVariants_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    -- Đảm bảo tên biến thể duy nhất trong cùng sản phẩm
    CONSTRAINT UQ_ProductVariants_ProductVariant UNIQUE (ProductId, VariantName)
);

-- =============================================
-- 3. BẢNG HÌNH ẢNH SẢN PHẨM
-- =============================================

CREATE TABLE ProductImages (
    ImageId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    VariantId INT NULL, -- NULL nếu ảnh chung cho sản phẩm
    ImageUrl NVARCHAR(500) NOT NULL,
    ImageAlt NVARCHAR(200) COLLATE Vietnamese_CI_AS NULL, -- Alt text cho SEO
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsMainImage BIT NOT NULL DEFAULT 0, -- Ảnh chính
    ImageType VARCHAR(20) NOT NULL DEFAULT 'product', -- product, gallery, thumbnail
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_ProductImages_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    CONSTRAINT FK_ProductImages_Variants FOREIGN KEY (VariantId) REFERENCES ProductVariants(VariantId)
);

-- =============================================
-- 4. BẢNG QUẢN LÝ NGƯỜI DÙNG
-- =============================================

-- Bảng vai trò người dùng
CREATE TABLE UserRoles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) COLLATE Vietnamese_CI_AS NOT NULL UNIQUE, -- Admin, Customer, Staff
    Description NVARCHAR(200) COLLATE Vietnamese_CI_AS NULL
);

-- Bảng người dùng
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Salt VARCHAR(255) NOT NULL, -- Để hash password an toàn hơn
    
    -- Thông tin cá nhân
    FirstName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    LastName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    FullName AS (FirstName + ' ' + LastName) PERSISTED, -- Computed column
    PhoneNumber VARCHAR(15) NULL,
    DateOfBirth DATE NULL,
    Gender VARCHAR(10) NULL, -- Male, Female, Other
    
    -- Địa chỉ mặc định
    DefaultAddress NVARCHAR(500) COLLATE Vietnamese_CI_AS NULL,
    Ward NVARCHAR(100) COLLATE Vietnamese_CI_AS NULL, -- Phường/Xã
    District NVARCHAR(100) COLLATE Vietnamese_CI_AS NULL, -- Quận/Huyện
    Province NVARCHAR(100) COLLATE Vietnamese_CI_AS NULL, -- Tỉnh/Thành phố
    
    -- Trạng thái tài khoản
    RoleId INT NOT NULL DEFAULT 2, -- Mặc định là Customer
    IsActive BIT NOT NULL DEFAULT 1,
    IsEmailVerified BIT NOT NULL DEFAULT 0,
    EmailVerificationToken VARCHAR(255) NULL,
    PasswordResetToken VARCHAR(255) NULL,
    PasswordResetExpiry DATETIME2 NULL,
    
    -- Audit
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    LastLoginAt DATETIME2 NULL,
    
    CONSTRAINT FK_Users_UserRoles FOREIGN KEY (RoleId) REFERENCES UserRoles(RoleId)
);

-- Bảng địa chỉ giao hàng (người dùng có thể có nhiều địa chỉ)
CREATE TABLE UserAddresses (
    AddressId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    AddressType VARCHAR(20) NOT NULL DEFAULT 'shipping', -- shipping, billing
    RecipientName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    AddressLine NVARCHAR(500) COLLATE Vietnamese_CI_AS NOT NULL,
    Ward NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    District NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    Province NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    PostalCode VARCHAR(10) NULL,
    IsDefault BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_UserAddresses_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- =============================================
-- 5. BẢNG GIỎ HÀNG
-- =============================================

CREATE TABLE ShoppingCarts (
    CartId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_ShoppingCarts_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE CartItems (
    CartItemId INT IDENTITY(1,1) PRIMARY KEY,
    CartId INT NOT NULL,
    VariantId INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(18,2) NOT NULL, -- Lưu giá tại thời điểm thêm vào giỏ
    AddedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_CartItems_Carts FOREIGN KEY (CartId) REFERENCES ShoppingCarts(CartId),
    CONSTRAINT FK_CartItems_Variants FOREIGN KEY (VariantId) REFERENCES ProductVariants(VariantId),
    CONSTRAINT CHK_CartItems_Quantity CHECK (Quantity > 0),
    -- Đảm bảo không trùng lặp sản phẩm trong giỏ hàng
    CONSTRAINT UQ_CartItems_CartVariant UNIQUE (CartId, VariantId)
);

-- =============================================
-- 6. BẢNG ĐƠN HÀNG
-- =============================================

-- Bảng trạng thái đơn hàng
CREATE TABLE OrderStatuses (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) COLLATE Vietnamese_CI_AS NOT NULL UNIQUE, -- Chờ xác nhận, Đã xác nhận, Đang giao hàng...
    Description NVARCHAR(200) COLLATE Vietnamese_CI_AS NULL,
    DisplayOrder INT NOT NULL DEFAULT 0
);

-- Bảng đơn hàng
CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    OrderNumber VARCHAR(50) NOT NULL UNIQUE, -- Mã đơn hàng duy nhất
    UserId INT NOT NULL,
    StatusId INT NOT NULL,
    
    -- Thông tin giao hàng
    ShippingName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    ShippingPhone VARCHAR(15) NOT NULL,
    ShippingAddress NVARCHAR(500) COLLATE Vietnamese_CI_AS NOT NULL,
    ShippingWard NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    ShippingDistrict NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    ShippingProvince NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL,
    
    -- Thông tin thanh toán
    SubTotal DECIMAL(18,2) NOT NULL, -- Tổng tiền hàng
    ShippingFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL, -- Tổng thanh toán
    
    -- Thông tin bổ sung
    Notes NVARCHAR(500) COLLATE Vietnamese_CI_AS NULL, -- Ghi chú của khách hàng
    AdminNotes NVARCHAR(500) COLLATE Vietnamese_CI_AS NULL, -- Ghi chú của admin
    PaymentMethod VARCHAR(50) NOT NULL, -- COD, BankTransfer, CreditCard
    PaymentStatus VARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Paid, Failed
    
    -- Audit
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CompletedAt DATETIME2 NULL,
    
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Orders_OrderStatuses FOREIGN KEY (StatusId) REFERENCES OrderStatuses(StatusId)
);

-- Bảng chi tiết đơn hàng
CREATE TABLE OrderItems (
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    VariantId INT NOT NULL,
    ProductName NVARCHAR(200) COLLATE Vietnamese_CI_AS NOT NULL, -- Lưu tên sản phẩm tại thời điểm đặt hàng
    VariantName NVARCHAR(100) COLLATE Vietnamese_CI_AS NOT NULL, -- Lưu tên biến thể
    UnitPrice DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice AS (UnitPrice * Quantity) PERSISTED, -- Computed column
    
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    CONSTRAINT FK_OrderItems_Variants FOREIGN KEY (VariantId) REFERENCES ProductVariants(VariantId),
    CONSTRAINT CHK_OrderItems_Quantity CHECK (Quantity > 0)
);

-- Bảng lịch sử trạng thái đơn hàng
CREATE TABLE OrderStatusHistory (
    HistoryId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    StatusId INT NOT NULL,
    ChangedBy INT NULL, -- UserId của người thay đổi
    Notes NVARCHAR(500) COLLATE Vietnamese_CI_AS NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_OrderStatusHistory_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    CONSTRAINT FK_OrderStatusHistory_OrderStatuses FOREIGN KEY (StatusId) REFERENCES OrderStatuses(StatusId),
    CONSTRAINT FK_OrderStatusHistory_Users FOREIGN KEY (ChangedBy) REFERENCES Users(UserId)
);

-- =============================================
-- 7. BẢNG KHUYẾN MÃI VÀ COUPON
-- =============================================

CREATE TABLE Coupons (
    CouponId INT IDENTITY(1,1) PRIMARY KEY,
    CouponCode VARCHAR(50) NOT NULL UNIQUE,
    CouponName NVARCHAR(200) COLLATE Vietnamese_CI_AS NOT NULL,
    Description NVARCHAR(500) COLLATE Vietnamese_CI_AS NULL,
    
    -- Loại giảm giá
    DiscountType VARCHAR(20) NOT NULL, -- Percentage, FixedAmount
    DiscountValue DECIMAL(18,2) NOT NULL,
    MaxDiscountAmount DECIMAL(18,2) NULL, -- Số tiền giảm tối đa (cho % discount)
    MinOrderAmount DECIMAL(18,2) NULL, -- Giá trị đơn hàng tối thiểu
    
    -- Thời gian hiệu lực
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    
    -- Giới hạn sử dụng
    UsageLimit INT NULL, -- Tổng số lần có thể sử dụng
    UsageCount INT NOT NULL DEFAULT 0, -- Số lần đã sử dụng
    UsageLimitPerUser INT NULL, -- Giới hạn mỗi user
    
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Bảng lưu lịch sử sử dụng coupon
CREATE TABLE CouponUsages (
    UsageId INT IDENTITY(1,1) PRIMARY KEY,
    CouponId INT NOT NULL,
    UserId INT NOT NULL,
    OrderId INT NOT NULL,
    DiscountAmount DECIMAL(18,2) NOT NULL,
    UsedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_CouponUsages_Coupons FOREIGN KEY (CouponId) REFERENCES Coupons(CouponId),
    CONSTRAINT FK_CouponUsages_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_CouponUsages_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);

-- =============================================
-- 8. BẢNG ĐÁNH GIÁ VÀ NHẬN XÉT
-- =============================================

CREATE TABLE ProductReviews (
    ReviewId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    UserId INT NOT NULL,
    OrderId INT NULL, -- Chỉ cho phép đánh giá khi đã mua
    Rating INT NOT NULL, -- 1-5 sao
    Title NVARCHAR(200) COLLATE Vietnamese_CI_AS NULL,
    ReviewText NVARCHAR(MAX) COLLATE Vietnamese_CI_AS NULL,
    
    -- Thông tin hữu ích
    HelpfulCount INT NOT NULL DEFAULT 0, -- Số người thấy review hữu ích
    IsVerifiedPurchase BIT NOT NULL DEFAULT 0,
    
    -- Trạng thái
    IsApproved BIT NOT NULL DEFAULT 0, -- Cần admin duyệt
    IsActive BIT NOT NULL DEFAULT 1,
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_ProductReviews_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    CONSTRAINT FK_ProductReviews_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_ProductReviews_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    CONSTRAINT CHK_ProductReviews_Rating CHECK (Rating BETWEEN 1 AND 5)
);

-- =============================================
-- 9. INDEXES FOR PERFORMANCE
-- =============================================

-- Products table indexes
CREATE NONCLUSTERED INDEX IX_Products_BrandId ON Products(BrandId);
CREATE NONCLUSTERED INDEX IX_Products_CategoryId ON Products(CategoryId);
CREATE NONCLUSTERED INDEX IX_Products_IsActive ON Products(IsActive);
CREATE NONCLUSTERED INDEX IX_Products_CreatedAt ON Products(CreatedAt DESC);

-- ProductVariants table indexes
CREATE NONCLUSTERED INDEX IX_ProductVariants_ProductId ON ProductVariants(ProductId);
CREATE NONCLUSTERED INDEX IX_ProductVariants_SKU ON ProductVariants(SKU);
CREATE NONCLUSTERED INDEX IX_ProductVariants_IsActive ON ProductVariants(IsActive);

-- Orders table indexes
CREATE NONCLUSTERED INDEX IX_Orders_UserId ON Orders(UserId);
CREATE NONCLUSTERED INDEX IX_Orders_StatusId ON Orders(StatusId);
CREATE NONCLUSTERED INDEX IX_Orders_CreatedAt ON Orders(CreatedAt DESC);
CREATE NONCLUSTERED INDEX IX_Orders_OrderNumber ON Orders(OrderNumber);

-- Users table indexes
CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);
CREATE NONCLUSTERED INDEX IX_Users_IsActive ON Users(IsActive);

-- =============================================
-- 10. INSERT SAMPLE DATA
-- =============================================

-- Insert User Roles
INSERT INTO UserRoles (RoleName, Description) VALUES 
(N'Quản trị viên', N'Quản trị viên hệ thống'),
(N'Khách hàng', N'Khách hàng mua hàng'),
(N'Nhân viên', N'Nhân viên bán hàng');

-- Insert Order Statuses
INSERT INTO OrderStatuses (StatusName, Description, DisplayOrder) VALUES 
(N'Chờ xác nhận', N'Đơn hàng đang chờ xác nhận', 1),
(N'Đã xác nhận', N'Đơn hàng đã được xác nhận', 2),
(N'Đang xử lý', N'Đơn hàng đang được xử lý', 3),
(N'Đang giao hàng', N'Đơn hàng đang được giao', 4),
(N'Đã giao hàng', N'Đơn hàng đã được giao thành công', 5),
(N'Đã hủy', N'Đơn hàng đã bị hủy', 6);

-- Insert Categories
INSERT INTO Categories (CategoryName, Description) VALUES 
(N'Điện thoại thông minh', N'Các loại điện thoại thông minh'),
(N'Máy tính bảng', N'Các loại máy tính bảng'),
(N'Phụ kiện', N'Phụ kiện điện thoại và máy tính bảng');

-- Insert Brands
INSERT INTO Brands (BrandName, Description) VALUES 
(N'Apple', N'Thương hiệu công nghệ hàng đầu từ Mỹ'),
(N'Samsung', N'Thương hiệu điện tử hàng đầu từ Hàn Quốc'),
(N'Xiaomi', N'Thương hiệu công nghệ nổi tiếng từ Trung Quốc'),
(N'Oppo', N'Thương hiệu điện thoại thông minh từ Trung Quốc'),
(N'Vivo', N'Thương hiệu điện thoại di động từ Trung Quốc');

-- =============================================
-- 11. ADDITIONAL CONSTRAINTS
-- =============================================

-- Thêm constraint kiểm tra email format
ALTER TABLE Users 
ADD CONSTRAINT CHK_Users_Email 
CHECK (Email LIKE '%@%.%' AND LEN(Email) > 5);

-- Thêm constraint kiểm tra phone number format (Vietnam)
ALTER TABLE Users 
ADD CONSTRAINT CHK_Users_PhoneNumber 
CHECK (PhoneNumber IS NULL OR PhoneNumber LIKE '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]');

-- Thêm constraint kiểm tra giá bán phải > 0
ALTER TABLE ProductVariants
ADD CONSTRAINT CHK_ProductVariants_Price
CHECK (SalePrice > 0 AND OriginalPrice > 0);

-- Thêm constraint kiểm tra tổng tiền đơn hàng
ALTER TABLE Orders
ADD CONSTRAINT CHK_Orders_TotalAmount
CHECK (TotalAmount >= 0);

PRINT 'PhoneStoreDB Database created successfully!'
GO
