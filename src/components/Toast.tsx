'use client'

import { useEffect } from 'react'

interface ToastProps {
  title: string
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ title, message, type = 'info', isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'fas fa-exclamation-circle text-red-500'
      case 'success':
        return 'fas fa-check-circle text-green-500'
      default:
        return 'fas fa-info-circle text-indigo-500'
    }
  }

  return (
    <div 
      id="toast" 
      className={`fixed top-5 right-5 z-[60] transform transition-transform duration-300 bg-white border-l-4 border-indigo-600 shadow-xl rounded p-4 flex items-center gap-3 min-w-[300px] ${
        isVisible ? 'translate-x-0' : 'translate-x-[150%]'
      }`}
    >
      <i className={`${getIcon()} text-xl`}></i>
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}