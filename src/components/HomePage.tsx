'use client'

import { useAppStore } from '@/lib/store'

export default function HomePage() {
  const { papers, teachers, setCurrentView, setFilters } = useAppStore()

  const latestPapers = [...papers]
    .sort((a, b) => new Date(b.uploadedAt || '').getTime() - new Date(a.uploadedAt || '').getTime())
    .slice(0, 6) // Let's take 6 papers for an even grid (2 columns on mobile, 3 on tablet, 6 on desktop!)

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm })
    setCurrentView('vault')
    window.history.pushState({ view: 'vault' }, '', '#vault')
  }

  const getBadgeClass = (type: string) => {
    return type === 'lab' 
      ? 'lab-badge px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider' 
      : 'theory-badge px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t: any) => t.id === teacherId)
    return teacher?.name || 'Unknown'
  }

  return (
    <section className="bg-white overflow-hidden">
      {/* Hero Section - Cohesive responsive grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Content Column */}
          <div className="lg:col-span-7 text-left sm:text-center lg:text-left">
            <p className="text-indigo-600 font-bold tracking-wider uppercase text-xs sm:text-sm mb-2.5">
              Stamford University Bangladesh
            </p>
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
              <span className="block">Unlock your</span>
              <span className="block text-indigo-600 mt-1">academic history.</span>
            </h1>
            <p className="mt-3 text-sm sm:text-lg text-gray-500 max-w-xl sm:mx-auto lg:mx-0 leading-relaxed">
              Find any past paper in 3 clicks or less. Browse by course, professor, or semester.
            </p>
            
            {/* Search Input Container */}
            <div className="mt-6 sm:mt-8 max-w-md sm:mx-auto lg:mx-0">
              <div className="relative rounded-xl shadow-sm border border-gray-150 overflow-hidden bg-gray-50/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400 text-sm"></i>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-4 py-3.5 sm:py-4 text-sm text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none" 
                  placeholder="Search Course (CSE101), Teacher..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch((e.target as HTMLInputElement).value)
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Action buttons - Mobile responsive grid */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:flex sm:flex-row gap-3 max-w-md sm:mx-auto lg:mx-0">
              <button 
                onClick={() => setCurrentView('vault')}
                className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-center transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-indigo-100/50 cursor-pointer active:scale-98"
              >
                <i className="fas fa-file-alt"></i> Browse All
              </button>
              <button 
                onClick={() => setCurrentView('course-list')}
                className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-center transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-indigo-100/50 cursor-pointer active:scale-98"
              >
                <i className="fas fa-book"></i> Courses
              </button>
              <button 
                onClick={() => setCurrentView('faculty')}
                className="col-span-2 sm:col-span-1 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-100 cursor-pointer active:scale-98"
              >
                <i className="fas fa-chalkboard-teacher"></i> Faculty List
              </button>
            </div>
          </div>
          
          {/* Hero Image Column */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video sm:aspect-[4/3] lg:aspect-square max-h-[280px] sm:max-h-[350px] lg:max-h-full">
              <img
                className="h-full w-full object-cover"
                src="/stamford.jpg"
                alt="Stamford University Campus"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Latest Uploads Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-gray-50">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i className="fas fa-bolt text-amber-500"></i> Just Uploaded
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {latestPapers.length > 0 ? latestPapers.map((paper: any) => (
            <div 
              key={paper.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-indigo-100 flex flex-col p-3 sm:p-4 group active:scale-98"
              onClick={() => window.open(paper.fileUrl, '_blank')}
            >
              <div className="flex flex-col gap-1.5 mb-2.5">
                <div className="flex justify-between items-center gap-1.5 w-full">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/50 max-w-full truncate">
                    {paper.courseCode}
                  </span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 shrink-0">
                    {paper.exam}
                  </span>
                </div>
                <div className="flex">
                  <span className={getBadgeClass(paper.type)}>
                    {paper.type}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors flex-1">
                {paper.courseName}
              </h3>
              <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-between border-t border-gray-50 pt-2 shrink-0">
                <span className="truncate max-w-[65%]">{getTeacherName(paper.teacherId)}</span>
                <span className="shrink-0">{paper.semester.split(' ')[0]}</span>
              </p>
            </div>
          )) : (
            <div className="col-span-full text-center py-10 text-gray-400 animate-pulse">
              {papers.length === 0 ? 'Archive is empty.' : 'Loading...'}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}