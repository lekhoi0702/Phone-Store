import React from 'react';
import { Users, Tag, Package, ShoppingCart, TrendingUp, DollarSign, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  // Mock data - sẽ được thay thế bằng API calls thực tế
  const stats = [
    {
      title: 'Tổng người dùng',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Thương hiệu',
      value: '45',
      change: '+3',
      changeType: 'positive',
      icon: Tag,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Danh mục',
      value: '28',
      change: '+2',
      changeType: 'positive',
      icon: Package,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: ShoppingCart,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫45.2M',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Tăng trưởng',
      value: '23.5%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn A', time: '5 phút trước', type: 'user' },
    { id: 2, action: 'Đơn hàng mới', user: 'Trần Thị B', time: '12 phút trước', type: 'order' },
    { id: 3, action: 'Thêm thương hiệu mới', user: 'Admin', time: '1 giờ trước', type: 'brand' },
    { id: 4, action: 'Cập nhật sản phẩm', user: 'Admin', time: '2 giờ trước', type: 'product' },
    { id: 5, action: 'Xóa danh mục', user: 'Admin', time: '3 giờ trước', type: 'category' }
  ];

  const quickStats = [
    { label: 'Đơn hàng đang xử lý', value: '23', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Sản phẩm hết hàng', value: '5', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'Đánh giá chưa phản hồi', value: '12', icon: Activity, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { label: 'Khách hàng mới hôm nay', value: '8', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'order': return <ShoppingCart className="w-4 h-4 text-green-500" />;
      case 'brand': return <Tag className="w-4 h-4 text-purple-500" />;
      case 'product': return <Package className="w-4 h-4 text-orange-500" />;
      case 'category': return <Package className="w-4 h-4 text-indigo-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-blue-100 text-lg">Tổng quan về hệ thống quản lý cửa hàng điện thoại</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Activity className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="xl:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Hoạt động gần đây
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Thống kê nhanh
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="text-sm text-gray-600">{stat.label}</span>
                      </div>
                      <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Khách hàng VIP</h4>
          <p className="text-2xl font-bold text-blue-600">156</p>
          <p className="text-xs text-gray-500 mt-1">Khách hàng thân thiết</p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Đơn hàng hoàn thành</h4>
          <p className="text-2xl font-bold text-green-600">1,089</p>
          <p className="text-xs text-gray-500 mt-1">Tháng này</p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Sản phẩm bán chạy</h4>
          <p className="text-2xl font-bold text-purple-600">iPhone 15</p>
          <p className="text-xs text-gray-500 mt-1">234 đơn hàng</p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Tăng trưởng</h4>
          <p className="text-2xl font-bold text-orange-600">+23.5%</p>
          <p className="text-xs text-gray-500 mt-1">So với tháng trước</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
