'use client'

import { useAppStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export default function TeacherProfilePage() {
  const { teachers, papers } = useAppStore()
  const [teacherId, setTeacherId] = useState<string | null>(null)
  const [teacher, setTeacher] = useState<any>(null)

  useEffect(() => {
    // Get teacherId from URL or state
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('teacherId') || window.history.state?.teacherId
    
    if (id) {
      setTeacherId(id)
      const foundTeacher = teachers.find((t: any) => t.id === id)
      setTeacher(foundTeacher || null)
    }
  }, [teachers])

  const handleBack = () => {
    window.history.back()
  }

  const getTeacherHistory = () => {
    if (!teacher) return []
    
    // If manual course history exists, use it
    if (teacher.courseHistory && teacher.courseHistory.length > 0) {
      return teacher.courseHistory
    }

    // Fallback to derived history from papers
    if (!teacherId) return []
    return papers.filter((paper: any) => paper.teacherId === teacherId).map((p: any) => ({
      ...p,
      status: 'taken' // Default for derived papers
    }))
  }

  if (!teacher) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-gray-500">
          <p>Teacher not found</p>
          <button onClick={handleBack} className="mt-4 text-indigo-600 hover:text-indigo-800">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const teacherHistory = getTeacherHistory()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={handleBack} className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8 card-hover">
        <div className="bg-indigo-600 h-24 sm:h-32"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 mb-4">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-200 flex items-center justify-center text-3xl overflow-hidden bg-white">
              <img 
                id="tp-img" 
                src={teacher.img || 'https://via.placeholder.com/150'} 
                alt={teacher.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
              <h1 id="tp-name" className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
              <p id="tp-desig" className="text-indigo-600 font-semibold text-sm">{teacher.designation}</p>
              <p id="tp-dept" className="text-sm font-medium text-gray-500">{teacher.dept}</p>
              <p id="tp-bio" className="text-sm text-gray-600 mt-2 max-w-lg">{teacher.bio}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden card-hover">
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-200">
          <h3 className="text-base sm:text-lg leading-6 font-bold text-gray-900">Course History</h3>
        </div>
        
        {teacherHistory.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody id="tp-history" className="bg-white divide-y divide-gray-200">
                  {teacherHistory.map((course: any, index: number) => (
                    <tr 
                      key={course.id || index} 
                      className={course.status === 'ongoing' ? 'bg-green-50' : ''}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.semester}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="font-bold mr-2">{course.courseCode}</span>
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        {course.status === 'ongoing' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ongoing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Taken
                          </span>
                        )}
                        {course.fileUrl && (
                          <button 
                            onClick={() => window.open(course.fileUrl, '_blank')}
                            className="ml-3 text-indigo-600 hover:underline text-xs"
                          >
                            View Paper
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden divide-y divide-gray-100">
              {teacherHistory.map((course: any, index: number) => (
                <div 
                  key={course.id || index}
                  className={`p-4 flex flex-col gap-2.5 ${course.status === 'ongoing' ? 'bg-green-50/40' : 'bg-white'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{course.semester}</span>
                    {course.status === 'ongoing' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-800">
                        Ongoing
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-800">
                        Taken
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold mb-1">{course.courseCode}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">{course.courseName}</h4>
                  </div>
                  {course.fileUrl && (
                    <button 
                      onClick={() => window.open(course.fileUrl, '_blank')}
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                    >
                      <i className="fas fa-file-pdf"></i> View Question Paper
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div id="tp-empty" className="px-6 py-8 text-center text-gray-500">
            No records found.
          </div>
        )}
      </div>
    </div>
  )
}