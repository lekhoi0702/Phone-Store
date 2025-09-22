# Phone Store Admin Panel

Giao diện quản trị cho hệ thống cửa hàng điện thoại, được xây dựng với React + Tailwind CSS.

## Tính năng

- 🔐 **Xác thực người dùng**: Đăng nhập/đăng xuất admin
- 📊 **Dashboard**: Tổng quan thống kê hệ thống
- 👥 **Quản lý người dùng**: CRUD operations cho người dùng
- 🏷️ **Quản lý thương hiệu**: CRUD operations cho thương hiệu
- 📦 **Quản lý danh mục**: CRUD operations cho danh mục
- 🎨 **Giao diện hiện đại**: Thiết kế responsive với Tailwind CSS
- 🔄 **Tích hợp API**: Kết nối với WebAPI backend

## Công nghệ sử dụng

- **React 18**: Framework frontend
- **Tailwind CSS**: Styling framework
- **React Router**: Routing
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **React Hot Toast**: Notifications
- **Lucide React**: Icons

## Cài đặt

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy development server:**
   ```bash
   npm run dev
   ```

3. **Build cho production:**
   ```bash
   npm run build
   ```

## Cấu hình

### API Endpoints

Ứng dụng được cấu hình để kết nối với WebAPI tại `http://localhost:5000/api`:

- **Auth**: `/api/auth/login`
- **Users**: `/api/user`
- **Brands**: `/api/brand`
- **Categories**: `/api/category`

### Environment Variables

Tạo file `.env` nếu cần thay đổi cấu hình:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Cấu trúc dự án

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Layout components (Sidebar, Header, Layout)
│   ├── DataTable.jsx   # Data table component
│   ├── Modal.jsx       # Modal component
│   └── LoginForm.jsx   # Login form component
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── UserManagement.jsx
│   ├── BrandManagement.jsx
│   ├── CategoryManagement.jsx
│   └── LoginPage.jsx
├── services/           # API services
│   └── api.js         # API configuration and endpoints
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Sử dụng

### Đăng nhập

1. Truy cập `/login`
2. Nhập email và mật khẩu admin
3. Sau khi đăng nhập thành công, sẽ được chuyển hướng đến dashboard

### Quản lý dữ liệu

- **Dashboard**: Xem tổng quan thống kê
- **Người dùng**: Thêm, sửa, xóa, xem danh sách người dùng
- **Thương hiệu**: Quản lý các thương hiệu sản phẩm
- **Danh mục**: Quản lý các danh mục sản phẩm

### Tính năng chính

- **Tìm kiếm**: Tìm kiếm dữ liệu theo tên, email
- **Phân trang**: Hiển thị dữ liệu theo trang
- **Modal forms**: Form thêm/sửa trong modal
- **Responsive**: Giao diện tương thích mobile
- **Toast notifications**: Thông báo thành công/lỗi

## API Integration

Ứng dụng sử dụng các API endpoints từ WebAPI:

### Authentication
```javascript
// Login
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

### Users
```javascript
// Get all users
GET /api/user

// Create user
POST /api/user
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  // ... other fields
}

// Update user
PUT /api/user/{id}

// Delete user
DELETE /api/user/{id}
```

### Brands
```javascript
// Get all brands
GET /api/brand

// Create brand
POST /api/brand
{
  "brandName": "Apple",
  "brandLogo": "https://example.com/logo.png",
  "description": "Brand description",
  "isActive": true
}

// Update brand
PUT /api/brand/{id}

// Delete brand
DELETE /api/brand/{id}
```

### Categories
```javascript
// Get all categories
GET /api/category

// Create category
POST /api/category
{
  "categoryName": "Smartphones",
  "description": "Category description",
  "isActive": true
}

// Update category
PUT /api/category/{id}

// Delete category
DELETE /api/category/{id}
```

## Development

### Scripts

- `npm run dev`: Chạy development server
- `npm run build`: Build cho production
- `npm run preview`: Preview build
- `npm run lint`: Chạy ESLint

### Code Style

- Sử dụng functional components với hooks
- Tailwind CSS cho styling
- ESLint cho code quality
- Prettier cho code formatting

## Troubleshooting

### Lỗi kết nối API

1. Kiểm tra WebAPI có đang chạy không
2. Kiểm tra URL API trong `vite.config.js`
3. Kiểm tra CORS settings trong WebAPI

### Lỗi authentication

1. Kiểm tra token có được lưu trong localStorage
2. Kiểm tra API response format
3. Kiểm tra AuthContext implementation

## License

MIT License
