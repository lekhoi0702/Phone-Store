import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { brandAPI } from '../services/api';
import toast from 'react-hot-toast';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await brandAPI.getAll();
      setBrands(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thương hiệu');
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = async (data) => {
    try {
      await brandAPI.create(data);
      toast.success('Tạo thương hiệu thành công');
      setIsModalOpen(false);
      reset();
      fetchBrands();
    } catch (error) {
      toast.error('Lỗi khi tạo thương hiệu');
      console.error('Error creating brand:', error);
    }
  };

  const handleUpdateBrand = async (data) => {
    try {
      await brandAPI.update(editingBrand.brandId, data);
      toast.success('Cập nhật thương hiệu thành công');
      setIsModalOpen(false);
      setEditingBrand(null);
      reset();
      fetchBrands();
    } catch (error) {
      toast.error('Lỗi khi cập nhật thương hiệu');
      console.error('Error updating brand:', error);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    reset({
      brandName: brand.brandName,
      brandLogo: brand.brandLogo,
      description: brand.description,
      isActive: brand.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (brand) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brand.brandName}"?`)) {
      try {
        await brandAPI.delete(brand.brandId);
        toast.success('Xóa thương hiệu thành công');
        fetchBrands();
      } catch (error) {
        toast.error('Lỗi khi xóa thương hiệu');
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    reset();
  };

  const filteredBrands = brands.filter(brand =>
    brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'brandId',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'brandName',
      header: 'Tên thương hiệu'
    },
    {
      key: 'brandLogo',
      header: 'Logo',
      render: (value) => (
        value ? (
          <img src={value} alt="Logo" className="w-10 h-10 object-contain rounded" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">No Logo</span>
          </div>
        )
      )
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
          <p className="text-gray-600">Quản lý thông tin các thương hiệu sản phẩm</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thương hiệu</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên thương hiệu..."
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
        data={filteredBrands}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        size="md"
      >
        <form onSubmit={handleSubmit(editingBrand ? handleUpdateBrand : handleCreateBrand)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thương hiệu *
            </label>
            <input
              {...register('brandName', { required: 'Tên thương hiệu không được để trống' })}
              type="text"
              className="input-field"
              placeholder="Nhập tên thương hiệu"
            />
            {errors.brandName && (
              <p className="text-sm text-red-600 mt-1">{errors.brandName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Logo
            </label>
            <input
              {...register('brandLogo')}
              type="url"
              className="input-field"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field"
              placeholder="Nhập mô tả về thương hiệu"
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
              Thương hiệu hoạt động
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
              {editingBrand ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BrandManagement;
