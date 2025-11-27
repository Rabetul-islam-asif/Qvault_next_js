'use client'

import { useAppStore } from '@/lib/store'
import { departments, seasons, years } from '@/lib/constants'

export default function VaultPage() {
  const { papers, teachers, filters, setFilters, resetFilters } = useAppStore()

  const filteredPapers = papers.filter((paper: any) => {
    const searchMatch = !filters.search || 
      JSON.stringify(paper).toLowerCase().includes(filters.search.toLowerCase())
    const deptMatch = !filters.dept || paper.dept === filters.dept
    
    // Split paper semester into season and year
    const [paperSeason, paperYear] = paper.semester.split(' ')
    
    const seasonMatch = !filters.season || paperSeason === filters.season
    const yearMatch = !filters.year || paperYear === filters.year
    const typeMatch = !filters.type || paper.type === filters.type
    
    return searchMatch && deptMatch && seasonMatch && yearMatch && typeMatch
  })

  const getBadgeClass = (type: string) => {
    return type === 'lab' 
      ? 'lab-badge px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider' 
      : 'theory-badge px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t: any) => t.id === teacherId)
    return teacher?.name || 'Unknown'
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto flex-none z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button 
            onClick={resetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Reset
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <input 
              type="text" 
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2" 
              placeholder="CSE 101..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              value={filters.dept}
              onChange={(e) => setFilters({ dept: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select 
                value={filters.season}
                onChange={(e) => setFilters({ season: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 bg-white"
              >
                <option value="">All</option>
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select 
                value={filters.year}
                onChange={(e) => setFilters({ year: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 bg-white"
              >
                <option value="">All</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input 
                  name="ftype" 
                  type="radio" 
                  value="theory" 
                  checked={filters.type === 'theory'}
                  onChange={(e) => setFilters({ type: e.target.value })}
                  className="text-indigo-600"
                />
                <label className="ml-2 block text-sm text-gray-700">Theory</label>
              </div>
              <div className="flex items-center">
                <input 
                  name="ftype" 
                  type="radio" 
                  value="lab" 
                  checked={filters.type === 'lab'}
                  onChange={(e) => setFilters({ type: e.target.value })}
                  className="text-indigo-600"
                />
                <label className="ml-2 block text-sm text-gray-700">Lab</label>
              </div>
              <div className="flex items-center">
                <input 
                  name="ftype" 
                  type="radio" 
                  value="" 
                  checked={filters.type === ''}
                  onChange={(e) => setFilters({ type: e.target.value })}
                  className="text-indigo-600"
                />
                <label className="ml-2 block text-sm text-gray-700">All</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Results <span className="text-sm font-normal text-gray-500 ml-2">({filteredPapers.length})</span>
          </h3>
        </div>
        
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPapers.map((paper: any) => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1 overflow-hidden group">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {paper.courseCode}
                      </span>
                      <span className={getBadgeClass(paper.type)}>
                        {paper.type.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100">{paper.exam}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">{paper.courseName}</h4>
                  <p className="text-xs text-gray-500 mb-3">{paper.semester}</p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center text-xs text-gray-600">
                    <span className="text-gray-400 mr-1">By:</span>
                    <span className="font-medium text-gray-700 truncate">{getTeacherName(paper.teacherId)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={() => window.open(paper.fileUrl, '_blank')}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    <i className="fas fa-eye mr-1.5"></i> Preview
                  </button>
                  <button 
                    onClick={() => window.open(paper.fileUrl, '_blank')}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-download mr-1.5"></i> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div id="vault-empty" className="text-center py-20 text-gray-400">
            <i className="fas fa-search text-4xl mb-4"></i>
            <p>No papers found.</p>
          </div>
        )}
      </div>
    </div>
  )
}