import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import BenefitsSection from '../components/BenefitsSection'
import LoginForm from '../components/LoginForm'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Section - Benefits & Mascot */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col justify-center px-12 py-16 w-full">
            {/* Brand Logos */}
            {/* <motion.div 
              className="flex gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                cellphone S
              </div>
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                dienthoaivui
              </div>
            </motion.div> */}

            {/* Main Title */}
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Nhập hội khách hàng thành viên{' '}
              <span className="text-primary-600">mobileSTORE</span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Để không bỏ lỡ các ưu đãi hấp dẫn từ mobileSTORE
            </motion.p>

            {/* Benefits Section */}
            <BenefitsSection />

            {/* Details Link */}
            {/* <motion.a
              href="#"
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Xem chi tiết chính sách ưu đãi Smember &gt;
            </motion.a> */}

          </div>
        </motion.div>

        {/* Right Section - Login Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
