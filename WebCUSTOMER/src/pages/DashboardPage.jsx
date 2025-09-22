import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Phone Store! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bạn đã đăng nhập thành công vào hệ thống SMEMBER
          </p>
          
          <motion.button
            onClick={() => navigate('/')}
            className="btn-primary text-lg px-8 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quay lại trang đăng nhập
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
