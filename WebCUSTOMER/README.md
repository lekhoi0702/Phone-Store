# Phone Store Customer - WebCUSTOMER

Giao diện đăng nhập hiện đại cho khách hàng Phone Store với thiết kế đẹp mắt và animation mượt mà.

## 🚀 Công nghệ sử dụng

- **React 18** - UI Framework
- **Vite** - Build tool nhanh
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **React Router** - Routing
- **React Icons** - Icon library
- **React Hot Toast** - Notification

## 🎨 Tính năng

- ✅ Giao diện đăng nhập đẹp mắt như thiết kế
- ✅ Animation mượt mà với Framer Motion
- ✅ Responsive design cho mobile/desktop
- ✅ Form validation với React Hook Form
- ✅ Social login buttons (Google, Zalo)
- ✅ Mascot character với animation
- ✅ Benefits section với icons
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 🌐 Truy cập

- **Development**: http://localhost:3001
- **Production**: Sau khi build

## 🔐 Test đăng nhập

- **Số điện thoại**: 0123456789
- **Mật khẩu**: 123456

## 📱 Responsive

- **Desktop**: Layout 2 cột (Benefits + Login Form)
- **Mobile**: Layout 1 cột (chỉ Login Form)
- **Tablet**: Responsive breakpoints

## 🎭 Animation

- Page transitions
- Form animations
- Mascot floating animation
- Voucher bouncing effects
- Button hover/tap effects
- Loading spinners

## 🎨 Design System

- **Primary Color**: Red (#ef4444)
- **Secondary Color**: Blue (#0ea5e9)
- **Typography**: Inter font family
- **Spacing**: Tailwind spacing scale
- **Shadows**: Subtle drop shadows
- **Borders**: Rounded corners

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── BenefitsSection.jsx
│   ├── LoginForm.jsx
│   └── MascotSection.jsx
├── pages/
│   ├── DashboardPage.jsx
│   └── LoginPage.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🔧 Customization

### Thay đổi màu sắc
Chỉnh sửa `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Thay đổi animation
Chỉnh sửa trong các component với Framer Motion:

```javascript
<motion.div
  animate={{ 
    y: [0, -10, 0],
    rotate: [-2, 2, -2]
  }}
  transition={{ 
    duration: 3,
    repeat: Infinity
  }}
>
```

## 🚀 Deployment

1. Build project: `npm run build`
2. Deploy thư mục `dist/` lên server
3. Cấu hình server để serve SPA

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.
