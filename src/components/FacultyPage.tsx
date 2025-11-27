'use client'

import { useAppStore } from '@/lib/store'
import { useState } from 'react'

export default function FacultyPage() {
  const { teachers, papers, setCurrentView } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTeachers = teachers.filter((teacher: any) => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPaperCount = (teacherId: string) => {
    return papers.filter((paper: any) => paper.teacherId === teacherId).length
  }

  const openProfile = (id: string) => {
    setCurrentView('teacher-profile')
    window.history.pushState({ view: 'teacher-profile', teacherId: id }, '', '#teacher-profile')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Faculty & Executives</h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">Browse professors and university executives to see their history.</p>
        <div className="mt-6 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border" 
              placeholder="Find a Professor..."
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTeachers.map((teacher: any) => (
          <div 
            key={teacher.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group card-hover" 
            onClick={() => openProfile(teacher.id)}
          >
            <div className="relative w-24 h-24 mb-4">
              <img 
                className="w-24 h-24 rounded-full object-cover" 
                src={teacher.img || 'https://via.placeholder.com/150'} 
                alt={teacher.name}
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">{teacher.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{teacher.dept}</p>
            <p className="text-xs text-gray-400 mt-1">{teacher.designation}</p>
            <div className="mt-2 text-xs text-indigo-600 font-medium">
              {getPaperCount(teacher.id)} papers
            </div>
            <button className="mt-4 text-xs font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full group-hover:bg-indigo-100">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}