import React from 'react'
import { motion } from 'framer-motion'
import { FaGift } from 'react-icons/fa'

const BenefitsSection = () => {
  const benefits = [
    "Giảm giá lên đến 5% khi mua sắm tại CellphoneS",
    "Miễn phí vận chuyển cho thành viên SMEM, SVIP với đơn hàng từ 300.000₫",
    "Voucher sinh nhật lên đến 500.000₫ cho khách hàng thành viên",
    "Hỗ trợ đổi cũ lấy mới lên đến 1 triệu",
    "Nâng cấp hạng để nhận voucher lên đến 300.000₫",
    "Đặc quyền S-Student/S-Teacher với thêm 10% giảm giá"
  ]

  return (
    <motion.div 
      className="bg-white rounded-xl border-2 border-primary-200 p-6 mb-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <motion.div 
            key={index}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
          >
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
              <FaGift className="w-3 h-3 text-primary-600" />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{benefit}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default BenefitsSection
