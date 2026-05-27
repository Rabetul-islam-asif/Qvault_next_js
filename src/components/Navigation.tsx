'use client'

import { useAppStore } from '@/lib/store'

export default function Navigation({ onUploadClick, onAdminClick }: { onUploadClick: () => void; onAdminClick: () => void }) {
  const { user, currentView, setCurrentView } = useAppStore()

  const handleNavigate = (view: string) => {
    setCurrentView(view)
    window.history.pushState({ view }, '', `#${view}`)
  }

  // Active state checker
  const isActive = (view: string) => currentView === view

  return (
    <>
      {/* Top Navbar - Fixed for desktop, clean logo only on mobile */}
      <nav className="bg-white border-b border-gray-100 shadow-sm z-20 flex-none sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo area - always visible, beautifully styled */}
            <div className="flex items-center cursor-pointer group" onClick={() => handleNavigate('home')}>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-indigo-700 transition-all duration-200 transform group-hover:rotate-3">Q</div>
                <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                  QVault <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 ml-1 font-semibold tracking-wider">LIVE</span>
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <div className="flex space-x-2 border-r border-gray-100 pr-6 mr-2">
                <button 
                  onClick={() => handleNavigate('home')} 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center ${
                    isActive('home') ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-home mr-2 text-sm opacity-80"></i> Home
                </button>
                <button 
                  onClick={() => handleNavigate('vault')} 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center ${
                    isActive('vault') ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-search mr-2 text-sm opacity-80"></i> Question Bank
                </button>
                <button 
                  onClick={() => handleNavigate('faculty')} 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center ${
                    isActive('faculty') ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-chalkboard-teacher mr-2 text-sm opacity-80"></i> Faculty List
                </button>
                <button 
                  onClick={onAdminClick} 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center ${
                    isActive('admin') ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-lock mr-2 text-sm opacity-80"></i> Admin
                </button>
              </div>
              <button 
                onClick={onUploadClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
              >
                <i className="fas fa-cloud-upload-alt mr-2"></i> Upload Paper
              </button>
            </div>
            
            {/* Minimal Mobile Header Button - Quick access for Admin */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={onAdminClick} 
                className={`p-2.5 rounded-lg border text-gray-500 transition-colors ${
                  isActive('admin') ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <i className="fas fa-user-shield text-base"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile App Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-150 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-safe-bottom">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2 relative">
          
          {/* Tab 1: Home */}
          <button 
            onClick={() => handleNavigate('home')} 
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-95"
          >
            <div className={`text-lg transition-all duration-200 ${isActive('home') ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}>
              <i className="fas fa-home"></i>
            </div>
            <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${isActive('home') ? 'text-indigo-600' : 'text-gray-400'}`}>
              Home
            </span>
          </button>

          {/* Tab 2: Question Bank */}
          <button 
            onClick={() => handleNavigate('vault')} 
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-95"
          >
            <div className={`text-lg transition-all duration-200 ${isActive('vault') ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}>
              <i className="fas fa-search"></i>
            </div>
            <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${isActive('vault') ? 'text-indigo-600' : 'text-gray-400'}`}>
              Vault
            </span>
          </button>

          {/* Tab 3: Centered Prominent Upload Action */}
          <div className="flex-1 flex justify-center -mt-6 relative z-50">
            <button 
              onClick={onUploadClick}
              aria-label="Upload Paper"
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-300 hover:shadow-xl transition-all duration-200 active:scale-90 border-4 border-white"
            >
              <i className="fas fa-cloud-upload-alt text-xl"></i>
            </button>
          </div>

          {/* Tab 4: Faculty */}
          <button 
            onClick={() => handleNavigate('faculty')} 
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-95"
          >
            <div className={`text-lg transition-all duration-200 ${isActive('faculty') ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}>
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${isActive('faculty') ? 'text-indigo-600' : 'text-gray-400'}`}>
              Faculty
            </span>
          </button>

          {/* Tab 5: Admin */}
          <button 
            onClick={onAdminClick} 
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-95"
          >
            <div className={`text-lg transition-all duration-200 ${isActive('admin') ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}>
              <i className="fas fa-lock"></i>
            </div>
            <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${isActive('admin') ? 'text-indigo-600' : 'text-gray-400'}`}>
              Admin
            </span>
          </button>

        </div>
      </div>
    </>
  )
}