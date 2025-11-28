'use client'

import { useAppStore } from '@/lib/store'
import { useState, useMemo } from 'react'
import { departments } from '@/lib/constants'

const STATIC_CSE_COURSES = [
  { code: 'CSE101', name: 'Structured Programming Language' },
  { code: 'CSE102', name: 'Discrete Mathematics' },
  { code: 'CSE105', name: 'Data Structures' },
  { code: 'CSE106', name: 'Data Structures Lab' },
  { code: 'CSE201', name: 'Object Oriented Programming' },
  { code: 'CSE203', name: 'Algorithms' },
  { code: 'CSE205', name: 'Digital Logic Design' },
  { code: 'CSE301', name: 'Database Management Systems' },
  { code: 'CSE303', name: 'Operating Systems' },
  { code: 'CSE305', name: 'Software Engineering' },
  { code: 'CSE307', name: 'Computer Networks' },
  { code: 'CSE401', name: 'Artificial Intelligence' },
]

export default function CourseListPage() {
  const { papers, setCurrentView, setFilters } = useAppStore()
  const [selectedDept, setSelectedDept] = useState('Computer Science & Engineering')
  const [searchTerm, setSearchTerm] = useState('')

  const courses = useMemo(() => {
    // Start with static courses if CSE
    let courseList = selectedDept === 'Computer Science & Engineering' 
      ? [...STATIC_CSE_COURSES] 
      : []

    // Add courses from papers
    const paperCourses = papers
      .filter((p: any) => p.dept === selectedDept)
      .map((p: any) => ({ code: p.courseCode, name: p.courseName }))

    // Merge and deduplicate
    paperCourses.forEach(pc => {
      if (!courseList.find(c => c.code === pc.code)) {
        courseList.push(pc)
      }
    })

    // Sort by code
    return courseList.sort((a, b) => a.code.localeCompare(b.code))
  }, [papers, selectedDept])

  const filteredCourses = courses.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCourseClick = (courseCode: string) => {
    setFilters({ search: courseCode })
    setCurrentView('vault')
    window.history.pushState({ view: 'vault' }, '', '#vault')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Course Catalog</h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Browse courses by department.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border" 
              placeholder="Search courses..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div 
              key={course.code}
              onClick={() => handleCourseClick(course.code)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer card-hover group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {course.code}
                </span>
                <i className="fas fa-arrow-right text-gray-300 group-hover:text-indigo-500 transition-colors"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                {course.name}
              </h3>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <i className="fas fa-book-open text-gray-300 text-4xl mb-3"></i>
            <p className="text-gray-500">No courses found for this department.</p>
          </div>
        )}
      </div>
    </div>
  )
}
