'use client'

import { useAppStore } from '@/lib/store'
import { departments, years, seasons, examTypes, theoryCourses, labCourses } from '@/lib/constants'
import { uploadToGoogleDrive, submitPendingPaper } from '@/lib/api'
import { useState } from 'react'

export default function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { teachers } = useAppStore()
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    dept: '',
    semSeason: 'Winter',
    semYear: new Date().getFullYear().toString(),
    type: 'theory' as 'theory' | 'lab',
    code: '',
    name: '',
    exam: 'Mid',
    teacherId: '',
    file: null as File | null
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'type') {
      const courses = value === 'theory' ? theoryCourses : labCourses
      setFormData(prev => ({ ...prev, code: courses[0] || '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file) {
      alert('Please select a PDF file')
      return
    }

    setUploading(true)
    try {
      const fileUrl = await uploadToGoogleDrive(formData.file)
      const fullSemester = `${formData.semSeason} ${formData.semYear}`
      
      await submitPendingPaper({
        courseCode: formData.code,
        courseName: formData.name,
        semester: fullSemester,
        exam: formData.exam,
        dept: formData.dept,
        type: formData.type,
        teacherId: formData.teacherId,
        fileUrl
      })

      onClose()
      window.location.reload() // Simple refresh to show new data
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const getCourses = () => formData.type === 'theory' ? theoryCourses : labCourses

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-transparent rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative z-10">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 pt-6 pb-14 px-5 sm:pt-8 sm:pb-16 sm:px-8 relative">
            <div className="flex justify-between items-start text-white">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Submit Question Paper</h3>
                <p className="text-indigo-100 text-xs sm:text-sm ml-0.5">Help us build the ultimate academic archive.</p>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div className="bg-white -mt-8 mx-3.5 mb-4 rounded-xl shadow-lg px-4 py-5 sm:px-8 sm:py-8 relative">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Department</label>
                    <select 
                      value={formData.dept} 
                      onChange={(e) => handleInputChange('dept', e.target.value)}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Semester & Year</label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.semSeason}
                        onChange={(e) => handleInputChange('semSeason', e.target.value)}
                        className="block w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        {seasons.map(season => (
                          <option key={season} value={season}>{season}</option>
                        ))}
                      </select>
                      <select 
                        value={formData.semYear}
                        onChange={(e) => handleInputChange('semYear', e.target.value)}
                        className="block w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <option value="theory">Theory</option>
                      <option value="lab">Lab</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Code</label>
                    <select 
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                      required
                    >
                      {getCourses().map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Course Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Introduction to CS"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Exam & Teacher</label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.exam}
                        onChange={(e) => handleInputChange('exam', e.target.value)}
                        className="block w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        {examTypes.map(exam => (
                          <option key={exam} value={exam}>{exam}</option>
                        ))}
                      </select>
                      <select 
                        value={formData.teacherId}
                        onChange={(e) => handleInputChange('teacherId', e.target.value)}
                        className="block w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                        required
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher: any) => (
                          <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-2 mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 text-center hover:bg-indigo-50 transition-all bg-gray-50 cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleInputChange('file', e.target.files?.[0] || null)}
                    />
                    <div className="mx-auto h-12 w-12 text-indigo-400 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <i className="fas fa-file-pdf text-xl"></i>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {formData.file ? formData.file.name : 'Click to upload PDF (Max 200MB)'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md disabled:opacity-50 flex items-center"
                >
                  {uploading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Uploading...
                    </>
                  ) : (
                    'Submit Paper'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}