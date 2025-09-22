import React from 'react';
import { Users, Tag, Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
  // Mock data - sẽ được thay thế bằng API calls thực tế
  const stats = [
    {
      title: 'Tổng người dùng',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Thương hiệu',
      value: '45',
      change: '+3',
      changeType: 'positive',
      icon: Tag,
      color: 'bg-green-500'
    },
    {
      title: 'Danh mục',
      value: '28',
      change: '+2',
      changeType: 'positive',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-orange-500'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫45.2M',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      title: 'Tăng trưởng',
      value: '23.5%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn A', time: '5 phút trước' },
    { id: 2, action: 'Đơn hàng mới', user: 'Trần Thị B', time: '12 phút trước' },
    { id: 3, action: 'Thêm thương hiệu mới', user: 'Admin', time: '1 giờ trước' },
    { id: 4, action: 'Cập nhật sản phẩm', user: 'Admin', time: '2 giờ trước' },
    { id: 5, action: 'Xóa danh mục', user: 'Admin', time: '3 giờ trước' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hệ thống quản lý cửa hàng điện thoại</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} so với tháng trước
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Đơn hàng đang xử lý</span>
              <span className="text-sm font-medium text-gray-900">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sản phẩm hết hàng</span>
              <span className="text-sm font-medium text-red-600">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Đánh giá chưa phản hồi</span>
              <span className="text-sm font-medium text-yellow-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Khách hàng mới hôm nay</span>
              <span className="text-sm font-medium text-green-600">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
