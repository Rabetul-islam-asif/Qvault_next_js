'use client'

import { useAppStore } from '@/lib/store'

export default function HomePage() {
  const { papers, teachers, setCurrentView, setFilters } = useAppStore()

  const latestPapers = [...papers]
    .sort((a, b) => new Date(b.uploadedAt || '').getTime() - new Date(a.uploadedAt || '').getTime())
    .slice(0, 5)

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm })
    setCurrentView('vault')
    window.history.pushState({ view: 'vault' }, '', '#vault')
  }

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
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
          <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <p className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2">Stamford University Bangladesh</p>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Unlock your</span>
                <span className="block text-indigo-600 xl:inline">academic history.</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Find any past paper in 3 clicks or less. Browse by course, professor, or semester.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input 
                    type="text" 
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-4 bg-gray-50 border" 
                    placeholder="Search by Course (CSE101), Teacher..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch((e.target as HTMLInputElement).value)
                      }
                    }}
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-4 flex-col sm:flex-row justify-center lg:justify-start">
                <button 
                  onClick={() => setCurrentView('vault')}
                  className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-8 card-hover"
                >
                  📄 Browse All
                </button>
                <button 
                  onClick={() => setCurrentView('course-list')}
                  className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-8 card-hover"
                >
                  📚 Course List
                </button>
                <button 
                  onClick={() => setCurrentView('faculty')}
                  className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-8 card-hover"
                >
                  👨‍🏫 Faculty List
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/stamford.jpg"
          alt="Stamford University"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Just Uploaded</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {latestPapers.length > 0 ? latestPapers.map((paper: any) => (
            <div 
              key={paper.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 card-hover"
              onClick={() => window.open(paper.fileUrl, '_blank')}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {paper.courseCode}
                  </span>
                  <span className={getBadgeClass(paper.type)}>
                    {paper.type.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">{paper.exam}</span>
              </div>
              <h3 className="font-medium text-gray-900 truncate">{paper.courseName}</h3>
              <p className="text-sm text-gray-500 mt-1">{paper.semester}</p>
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