'use client'

import { useAppStore } from '@/lib/store'

export default function LoginModal({ isOpen, onClose, onLogin }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogin: (success: boolean) => void 
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    if (username === 'admin' && password === 'admin') {
      onLogin(true)
      onClose()
    } else {
      alert('Invalid credentials')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 hidden flex items-center justify-center" style={{ display: 'flex' }}>
      <div className="absolute inset-0 bg-gray-900/95" onClick={onClose}></div>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm z-10 text-center border-t-4 border-indigo-600">
        <div className="mx-auto h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <i className="fas fa-lock text-indigo-400 text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Restricted Access</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="username" 
            type="text" 
            placeholder="Admin ID" 
            className="w-full border-gray-300 border p-3 rounded-xl bg-gray-50"
            required
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            className="w-full border-gray-300 border p-3 rounded-xl bg-gray-50"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 shadow-md transform hover:-translate-y-0.5 transition-all"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  )
}