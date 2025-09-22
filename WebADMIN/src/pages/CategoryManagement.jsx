import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { categoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách danh mục');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (data) => {
    try {
      await categoryAPI.create(data);
      toast.success('Tạo danh mục thành công');
      setIsModalOpen(false);
      reset();
      fetchCategories();
    } catch (error) {
      toast.error('Lỗi khi tạo danh mục');
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (data) => {
    try {
      await categoryAPI.update(editingCategory.categoryId, data);
      toast.success('Cập nhật danh mục thành công');
      setIsModalOpen(false);
      setEditingCategory(null);
      reset();
      fetchCategories();
    } catch (error) {
      toast.error('Lỗi khi cập nhật danh mục');
      console.error('Error updating category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    reset({
      categoryName: category.categoryName,
      description: category.description,
      isActive: category.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.categoryName}"?`)) {
      try {
        await categoryAPI.delete(category.categoryId);
        toast.success('Xóa danh mục thành công');
        fetchCategories();
      } catch (error) {
        toast.error('Lỗi khi xóa danh mục');
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const filteredCategories = categories.filter(category =>
    category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'categoryId',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'categoryName',
      header: 'Tên danh mục'
    },
    {
      key: 'description',
      header: 'Mô tả',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value || 'Không có mô tả'}
        </div>
      )
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600">Quản lý các danh mục sản phẩm trong hệ thống</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên danh mục..."
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
        data={filteredCategories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        size="md"
      >
        <form onSubmit={handleSubmit(editingCategory ? handleUpdateCategory : handleCreateCategory)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục *
            </label>
            <input
              {...register('categoryName', { required: 'Tên danh mục không được để trống' })}
              type="text"
              className="input-field"
              placeholder="Nhập tên danh mục"
            />
            {errors.categoryName && (
              <p className="text-sm text-red-600 mt-1">{errors.categoryName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field"
              placeholder="Nhập mô tả về danh mục"
            />
          </div>

          <div className="flex items-center">
            <input
              {...register('isActive')}
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Danh mục hoạt động
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {editingCategory ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
