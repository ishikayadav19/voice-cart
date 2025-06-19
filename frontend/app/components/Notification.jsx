"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Info, XCircle } from 'lucide-react'

const Notification = ({ notification }) => {
  if (!notification) return null

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  }

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${colors[notification.type]} flex items-center gap-2`}
      >
        {icons[notification.type]}
        <span>{notification.message}</span>
      </motion.div>
    </AnimatePresence>
  )
}

export default Notification 