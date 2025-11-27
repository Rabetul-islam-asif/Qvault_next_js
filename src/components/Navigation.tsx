'use client'

import { useAppStore } from '@/lib/store'

export default function Navigation({ onUploadClick, onAdminClick }: { onUploadClick: () => void; onAdminClick: () => void }) {
  const { user, setCurrentView } = useAppStore()

  const handleNavigate = (view: string) => {
    setCurrentView(view)
    window.history.pushState({ view }, '', `#${view}`)
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm z-20 flex-none sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => handleNavigate('home')}>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-indigo-700 transition-colors">Q</div>
                <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-indigo-700 transition-colors">QVault <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 ml-1 font-normal">Live</span></span>
              </div>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-6">
              <div className="flex space-x-4 border-r border-gray-200 pr-6 mr-2">
                <button 
                  onClick={() => handleNavigate('vault')} 
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center"
                >
                  <i className="fas fa-search mr-2 text-gray-400"></i> Question Bank
                </button>
                <button 
                  onClick={() => handleNavigate('faculty')} 
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center"
                >
                  <i className="fas fa-chalkboard-teacher mr-2 text-gray-400"></i> Faculty List
                </button>
                <button 
                  onClick={onAdminClick} 
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center"
                >
                  <i className="fas fa-lock mr-2 text-gray-400"></i> Admin
                </button>
              </div>
              <button 
                onClick={onUploadClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
              >
                <i className="fas fa-cloud-upload-alt mr-2"></i> Upload Paper
              </button>
            </div>
            
            <div className="flex items-center md:hidden gap-2">
              <button onClick={onUploadClick} className="text-indigo-600 bg-indigo-50 p-2 rounded-lg"><i className="fas fa-cloud-upload-alt"></i></button>
              <button onClick={() => handleNavigate('vault')} className="text-gray-500 p-2"><i className="fas fa-search"></i></button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}