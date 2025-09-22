import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      // Hash password to match backend's PasswordHash field requirement
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(data.password, salt);

      const payload = {
        email: data.email,
        passwordHash: passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: true,
      };

      await userAPI.create(payload);
      toast.success('Tạo tài khoản thành công');
      setIsModalOpen(false);
      reset();
      fetchUsers();

      // Note: Backend hiện đang cố định RoleId = 3 trong CreateUser => không thể tạo tài khoản Nhân viên cho đến khi backend cho phép set RoleId.
    } catch (error) {
      toast.error('Lỗi khi tạo tài khoản');
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (data) => {
    try {
      await userAPI.update(editingUser.userId, data);
      toast.success('Cập nhật người dùng thành công');
      setIsModalOpen(false);
      setEditingUser(null);
      reset();
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi khi cập nhật người dùng');
      console.error('Error updating user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      defaultAddress: user.defaultAddress,
      ward: user.ward,
      district: user.district,
      province: user.province,
      isActive: user.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.firstName} ${user.lastName}?`)) {
      try {
        await userAPI.delete(user.userId);
        toast.success('Xóa người dùng thành công');
        fetchUsers();
      } catch (error) {
        toast.error('Lỗi khi xóa người dùng');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'userId',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'firstName',
      header: 'Họ tên',
      render: (value, user) => `${user.firstName} ${user.lastName}`
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'phoneNumber',
      header: 'Số điện thoại'
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (value) => new Date(value).toLocaleDateString('vi-VN')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600">Quản lý thông tin người dùng trong hệ thống</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); reset(); setEditingUser(null); }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tài khoản nhân viên</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Tạo tài khoản nhân viên'}
        size="lg"
      >
        {/* Creation form: minimal fields for Staff */}
        {!editingUser && (
          <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ *</label>
                <input
                  {...register('firstName', { required: 'Họ không được để trống' })}
                  type="text"
                  className="input-field"
                  placeholder="Nhập họ"
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                <input
                  {...register('lastName', { required: 'Tên không được để trống' })}
                  type="text"
                  className="input-field"
                  placeholder="Nhập tên"
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                {...register('email', {
                  required: 'Email không được để trống',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email không hợp lệ' }
                })}
                type="email"
                className="input-field"
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input
                {...register('password', { required: 'Mật khẩu không được để trống', minLength: { value: 6, message: 'Ít nhất 6 ký tự' } })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={handleCloseModal} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Tạo tài khoản</button>
            </div>
          </form>
        )}

        {/* Editing form: full fields as before */}
        {editingUser && (
          <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ *</label>
                <input {...register('firstName', { required: 'Họ không được để trống' })} type="text" className="input-field" />
                {errors.firstName && (<p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                <input {...register('lastName', { required: 'Tên không được để trống' })} type="text" className="input-field" />
                {errors.lastName && (<p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input {...register('email', { required: 'Email không được để trống' })} type="email" className="input-field" />
              {errors.email && (<p className="text-sm text-red-600 mt-1">{errors.email.message}</p>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input {...register('phoneNumber')} type="tel" className="input-field" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input {...register('dateOfBirth')} type="date" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <select {...register('gender')} className="input-field">
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input {...register('defaultAddress')} type="text" className="input-field" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <input {...register('ward')} type="text" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <input {...register('district')} type="text" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                <input {...register('province')} type="text" className="input-field" />
              </div>
            </div>

            <div className="flex items-center">
              <input {...register('isActive')} type="checkbox" id="isActive" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Tài khoản hoạt động</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={handleCloseModal} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Cập nhật</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
