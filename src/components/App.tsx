'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { fetchTeachers, fetchPapers, fetchPendingPapers } from '@/lib/api'
import Navigation from '@/components/Navigation'
import HomePage from '@/components/HomePage'
import VaultPage from '@/components/VaultPage'
import FacultyPage from '@/components/FacultyPage'
import TeacherProfilePage from '@/components/TeacherProfilePage'
import AdminDashboard from '@/components/AdminDashboard'
import UploadModal from '@/components/UploadModal'
import LoginModal from '@/components/LoginModal'
import Toast from '@/components/Toast'

export default function App() {
  const { 
    currentView, 
    user, 
    setTeachers, 
    setPapers, 
    setPending, 
    setUser, 
    setCurrentView 
  } = useAppStore()
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, title: '', message: '', type: 'info' as const })

  useEffect(() => {
    // Initial data fetch
    const loadData = async () => {
      try {
        const [teachersData, papersData, pendingData] = await Promise.all([
          fetchTeachers(),
          fetchPapers(),
          fetchPendingPapers()
        ])
        
        setTeachers(teachersData)
        setPapers(papersData)
        setPending(pendingData)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }

    loadData()

    // Set up real-time subscriptions
    const channels = [
      supabase.channel('teachers-changes'),
      supabase.channel('papers-changes'),
      supabase.channel('pending_papers-changes')
    ]

    channels[0].on('postgres_changes', 
      { event: '*', schema: 'public', table: 'teachers' }, 
      () => loadData()
    ).subscribe()

    channels[1].on('postgres_changes', 
      { event: '*', schema: 'public', table: 'papers' }, 
      () => loadData()
    ).subscribe()

    channels[2].on('postgres_changes', 
      { event: '*', schema: 'public', table: 'pending_papers' }, 
      () => loadData()
    ).subscribe()

    // Handle browser back/forward
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view)
      } else {
        setCurrentView('home')
      }
    }

    window.addEventListener('popstate', handlePopState)

    // Set initial view from URL
    const hash = window.location.hash.slice(1)
    if (hash && ['home', 'vault', 'faculty', 'teacher-profile', 'admin'].includes(hash)) {
      setCurrentView(hash)
    }

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel))
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handleNavigate = (view: string) => {
    if (view === 'admin' && !user) {
      setLoginModalOpen(true)
    } else {
      setCurrentView(view)
      window.history.pushState({ view }, '', `#${view}`)
    }
  }

  const handleAdminClick = () => {
    if (user) {
      setCurrentView('admin')
      window.history.pushState({ view: 'admin' }, '', '#admin')
    } else {
      setLoginModalOpen(true)
    }
  }

  const handleLogin = (success: boolean) => {
    if (success) {
      setUser('admin')
      setCurrentView('admin')
      window.history.pushState({ view: 'admin' }, '', '#admin')
    }
  }

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ isVisible: true, title, message, type })
  }

  const renderCurrentPage = () => {
    switch (currentView) {
      case 'vault':
        return <VaultPage />
      case 'faculty':
        return <FacultyPage />
      case 'teacher-profile':
        return <TeacherProfilePage />
      case 'admin':
        return user ? <AdminDashboard /> : <HomePage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="bg-gray-50 text-gray-800 font-sans h-screen flex flex-col overflow-hidden">
      <Navigation onUploadClick={() => setUploadModalOpen(true)} onAdminClick={handleAdminClick} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar relative" id="main-container">
        {renderCurrentPage()}
      </main>

      <footer className="py-2 text-center text-xs text-gray-400 bg-gray-50 border-t border-gray-200">
        Developed by Asif Rabetul
      </footer>

      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} onLogin={handleLogin} />
      <Toast 
        title={toast.title}
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Add Upload Button for mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setUploadModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <i className="fas fa-cloud-upload-alt"></i>
        </button>
      </div>
    </div>
  )
}