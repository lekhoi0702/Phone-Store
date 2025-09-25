import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash, FaGoogle, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [promotionalOptIn, setPromotionalOptIn] = useState(false)
  const [vatInvoice, setVatInvoice] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone || null,
        dateOfBirth: data.birthDate || null,
        gender: null,
        defaultAddress: null,
        ward: null,
        district: null,
        province: null,
        roleId: 2,
      }
      const res = await authApi.registerCustomer(payload)
      if (res.data?.success) {
        toast.success('Đăng ký thành công!')
        navigate('/login')
      } else {
        const msg = res.data?.message || 'Đăng ký thất bại'
        const errs = res.data?.error?.join(', ')
        toast.error(errs ? `${msg}: ${errs}` : msg)
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký'
      const errs = error.response?.data?.error?.join(', ')
      toast.error(errs ? `${msg}: ${errs}` : msg)
    }
  }

  const handleSocialRegister = (provider) => {
    toast.info(`Đăng ký bằng ${provider} đang được phát triển!`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Đăng ký trở thành SMEMBER
          </h1>
          
          {/* Mascot */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full border-4 border-red-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-red-600">S</span>
              </div>
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 rounded-full"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👍</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Social Login Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-center text-gray-600 mb-4">
              Đăng ký bằng tài khoản mạng xã hội
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => handleSocialRegister('Google')}
                className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="text-blue-500 text-xl" />
                <span className="font-medium">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialRegister('Zalo')}
                className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Z</span>
                </div>
                <span className="font-medium">Zalo</span>
              </button>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="text-gray-500">Hoặc điền thông tin sau</span>
          </motion.div>

          {/* Personal Information Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  <input
                    type="text"
                    {...register('lastName', { required: 'Vui lòng nhập họ' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập họ"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Vui lòng nhập số điện thoại',
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'Vui lòng nhập tên' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập tên"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register('birthDate')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Vui lòng nhập email',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                  
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="vatInvoice"
                      checked={vatInvoice}
                      onChange={(e) => setVatInvoice(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="vatInvoice" className="ml-2 text-sm text-gray-600">
                      Hóa đơn VAT khi mua hàng sẽ được gửi qua email này
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Password Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tạo mật khẩu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu tối thiểu 6 ký tự'
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)/,
                        message: 'Mật khẩu phải có ít nhất 1 chữ cái và 1 số'
                      }
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu của bạn"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Mật khẩu tối thiểu 6 ký tự, có ít nhất 1 chữ cái và 1 số
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Vui lòng nhập lại mật khẩu',
                      validate: value => value === password || 'Mật khẩu không khớp'
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu của bạn"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Promotional Opt-in */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id="promotional"
                checked={promotionalOptIn}
                onChange={(e) => setPromotionalOptIn(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="promotional" className="ml-2 text-sm text-gray-700">
                Đăng ký nhận tin khuyến mãi từ CellphoneS
              </label>
            </div>
          </motion.div>

          {/* Terms and Conditions */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <p className="text-sm text-gray-600">
              Bằng việc Đăng ký, bạn đã đọc và đồng ý với{' '}
              <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a>
              {' '}và{' '}
              <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
              {' '}của Cellphones.
            </p>
          </motion.div>

          {/* Student/Teacher Section */}
          <motion.div
            className="mb-8 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">
                Tôi là Học sinh - sinh viên / Giáo viên - giảng viên
              </h4>
              <button
                type="button"
                onClick={() => setIsStudent(!isStudent)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isStudent ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isStudent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Nhận thêm ưu đãi tới 600k/sản phẩm{' '}
              <a href="#" className="text-blue-600 hover:underline">Xem chi tiết &gt;</a>
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-8 py-3 hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft />
              <span className="font-medium">Quay lại đăng nhập</span>
            </Link>
            <button
              type="submit"
              className="bg-red-600 text-white rounded-lg px-8 py-3 hover:bg-red-700 transition-colors font-medium"
            >
              Hoàn tất đăng ký
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
