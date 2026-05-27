'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { departments, seasons, years } from '@/lib/constants'

export default function VaultPage() {
  const { papers, teachers, filters, setFilters, resetFilters } = useAppStore()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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

  // Calculate active filter count
  const activeFiltersCount = [
    filters.search ? 1 : 0,
    filters.dept ? 1 : 0,
    filters.season ? 1 : 0,
    filters.year ? 1 : 0,
    filters.type ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  const getBadgeClass = (type: string) => {
    return type === 'lab' 
      ? 'lab-badge px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider' 
      : 'theory-badge px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t: any) => t.id === teacherId)
    return teacher?.name || 'Unknown'
  }

  // Reuseable filter elements to avoid duplication
  const FilterElements = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keywords</label>
        <input 
          type="text" 
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm border p-2.5 bg-gray-50/50" 
          placeholder="CSE 101, Algorithms..."
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
        <select 
          value={filters.dept}
          onChange={(e) => setFilters({ dept: e.target.value })}
          className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm border p-2.5 bg-white"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Semester</label>
          <select 
            value={filters.season}
            onChange={(e) => setFilters({ season: e.target.value })}
            className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm border p-2.5 bg-white"
          >
            <option value="">All</option>
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Year</label>
          <select 
            value={filters.year}
            onChange={(e) => setFilters({ year: e.target.value })}
            className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm border p-2.5 bg-white"
          >
            <option value="">All</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Type</label>
        <div className="flex gap-2">
          {['theory', 'lab', ''].map((t) => (
            <button
              key={t}
              onClick={() => setFilters({ type: t })}
              className={`flex-1 py-2 px-3 border rounded-lg text-xs font-bold transition-all ${
                filters.type === t
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t === '' ? 'All' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Desktop Filters Pane - hidden on mobile, elegant sidebar on desktop */}
      <aside className="hidden md:block w-72 bg-white border-r border-gray-150 p-6 overflow-y-auto flex-none z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-sliders-h text-indigo-600 text-sm"></i> Filters
          </h2>
          {activeFiltersCount > 0 && (
            <button 
              onClick={resetFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Reset ({activeFiltersCount})
            </button>
          )}
        </div>
        <FilterElements />
      </aside>

      {/* Mobile Sticky Filter Trigger Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Results ({filteredPapers.length})
        </span>
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all active:scale-95 ${
            activeFiltersCount > 0
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100'
              : 'bg-indigo-50 border-indigo-100 text-indigo-700'
          }`}
        >
          <i className="fas fa-filter"></i> Filters
          {activeFiltersCount > 0 && (
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${
              activeFiltersCount > 0 ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
            }`}>
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Main Results View */}
      <div className="flex-1 bg-gray-50/50 p-4 sm:p-6 overflow-y-auto">
        <div className="hidden md:flex mb-6 justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Search Results <span className="text-sm font-normal text-gray-400 ml-1.5">({filteredPapers.length} papers found)</span>
          </h3>
        </div>
        
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredPapers.map((paper: any) => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-150 flex flex-col h-full transition-all duration-200 hover:shadow-md overflow-hidden group hover:border-indigo-150 active:scale-98">
                <div className="p-3.5 sm:p-5 flex-1 flex flex-col">
                  <div className="flex flex-col gap-1.5 mb-2.5">
                    <div className="flex justify-between items-center gap-1.5 w-full">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/50 max-w-full truncate">
                        {paper.courseCode}
                      </span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 shrink-0">{paper.exam}</span>
                    </div>
                    <div className="flex">
                      <span className={getBadgeClass(paper.type)}>
                        {paper.type}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors flex-1">{paper.courseName}</h4>
                  <p className="text-[10px] text-gray-400 mt-2">{paper.semester}</p>
                  
                  <div className="mt-2.5 pt-2.5 border-t border-gray-50 flex items-center text-[10px] text-gray-500">
                    <span className="text-gray-400 mr-1 shrink-0">By:</span>
                    <span className="font-semibold text-gray-700 truncate">{getTeacherName(paper.teacherId)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-3 py-2 border-t border-gray-100 flex gap-1.5">
                  <button 
                    onClick={() => window.open(paper.fileUrl, '_blank')}
                    className="flex-1 flex items-center justify-center px-2 py-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                  >
                    <i className="fas fa-eye mr-1"></i> View
                  </button>
                  <button 
                    onClick={() => window.open(paper.fileUrl, '_blank')}
                    className="flex-1 flex items-center justify-center px-2 py-1.5 text-[10px] font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <i className="fas fa-download mr-1"></i> Get
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div id="vault-empty" className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 mt-4">
            <i className="fas fa-search text-3xl mb-3 text-gray-300"></i>
            <p className="text-sm font-medium">No question papers match your filters.</p>
          </div>
        )}
      </div>

      {/* Mobile Filters Slide-Up Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setMobileFiltersOpen(false)}></div>
          
          {/* Drawer Sheet */}
          <div className="relative bg-white rounded-t-2xl shadow-2xl p-5 max-h-[85vh] overflow-y-auto z-10 transition-transform transform translate-y-0 flex flex-col pb-safe-bottom border-t border-gray-100">
            {/* Drawer Handle */}
            <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <i className="fas fa-sliders-h text-indigo-600"></i> Filter Options
              </h3>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={resetFilters} 
                    className="text-xs font-bold text-indigo-600 px-2 py-1 bg-indigo-50 rounded"
                  >
                    Reset
                  </button>
                )}
                <button 
                  onClick={() => setMobileFiltersOpen(false)} 
                  className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 bg-gray-800 rounded"
                >
                  Done
                </button>
              </div>
            </div>
            
            {/* Filters Form */}
            <div className="flex-1 overflow-y-auto pb-4">
              <FilterElements />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}