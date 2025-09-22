import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock successful login
      if (data.email === 'admin@phonestore.com' && data.password === 'admin123') {
        toast.success('Đăng nhập thành công!')
        navigate('/dashboard')
      } else {
        toast.error('Email hoặc mật khẩu không đúng!')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    toast.info(`Đăng nhập bằng ${provider} đang được phát triển!`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <motion.h2
        className="text-3xl font-bold text-primary-600 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Đăng nhập mobileSTORE
      </motion.h2>

      {/* Information Box */}
      {/* <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="text-blue-800 text-sm leading-relaxed">
          Trải nghiệm đăng nhập liền mạch giữa CellphoneS và Điện Thoại Vui, 
          ưu tiên tài khoản CellphoneS.
        </p>
      </motion.div> */}

      {/* Login Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email không hợp lệ'
              }
            })}
            className="input-field"
            placeholder="Nhập email của bạn"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
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
                  message: 'Mật khẩu phải có ít nhất 6 ký tự'
                }
              })}
              className="input-field pr-12"
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
        </div>

        {/* Login Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang đăng nhập...
            </div>
          ) : (
            'Đăng nhập'
          )}
        </motion.button>

        {/* Forgot Password */}
        <div className="text-center">
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Quên mật khẩu?
          </a>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="btn-secondary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGoogle className="text-red-500" />
            Google
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleSocialLogin('Zalo')}
            className="btn-secondary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaFacebook className="text-blue-600" />
            Zalo
          </motion.button>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-600">Bạn chưa có tài khoản? </span>
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Đăng ký ngay
          </Link>
        </div>
      </motion.form>

      {/* Footer Links */}
      {/* <motion.div
        className="mt-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p>Mua sắm, sửa chữa tại</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            cellphones.com.vn
          </a>
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            dienthoaivui.com.vn
          </a>
        </div>
      </motion.div> */}
    </motion.div>
  )
}

export default LoginForm
