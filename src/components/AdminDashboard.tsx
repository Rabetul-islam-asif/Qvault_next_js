'use client'

import { useAppStore } from '@/lib/store'
import { approvePaper, rejectPaper, deletePaper, saveTeacher, deleteTeacher } from '@/lib/api'
import { departments } from '@/lib/constants'
import { useState } from 'react'

export default function AdminDashboard() {
  const { teachers, papers, pending, setUser, setTeachers, setPapers, setPending } = useAppStore()
  const [activeTab, setActiveTab] = useState('uploads')
  const [paperSearch, setPaperSearch] = useState('')
  const [editingTeacher, setEditingTeacher] = useState<any>(null)
  const [teacherModalOpen, setTeacherModalOpen] = useState(false)
  const [editingCourses, setEditingCourses] = useState<any[]>([])

  const handleLogout = () => {
    setUser(null)
    window.history.pushState({ view: 'home' }, '', '#home')
  }

  const handleApprovePaper = async (id: string) => {
    const paper = pending.find((p: any) => p.id === id)
    if (!paper) return
    
    try {
      await approvePaper(id, paper)
      // Refresh data
      setPending(pending.filter((p: any) => p.id !== id))
      setPapers([...papers, { ...paper, id: Date.now().toString(), uploadedAt: new Date().toISOString() }])
    } catch (error) {
      console.error('Approval failed:', error)
      alert('Approval failed')
    }
  }

  const handleRejectPaper = async (id: string) => {
    if (!confirm('Reject this paper?')) return
    
    try {
      await rejectPaper(id)
      setPending(pending.filter((p: any) => p.id !== id))
    } catch (error) {
      console.error('Rejection failed:', error)
      alert('Rejection failed')
    }
  }

  const handleDeletePaper = async (id: string) => {
    if (!confirm('Delete this paper?')) return
    
    try {
      await deletePaper(id)
      setPapers(papers.filter((p: any) => p.id !== id))
    } catch (error) {
      console.error('Deletion failed:', error)
      alert('Deletion failed')
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('Delete this teacher?')) return
    
    try {
      await deleteTeacher(id)
      setTeachers(teachers.filter((t: any) => t.id !== id))
    } catch (error) {
      console.error('Deletion failed:', error)
      alert('Deletion failed')
    }
  }

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const teacherData = {
      name: formData.get('name') as string,
      dept: formData.get('dept') as string,
      designation: formData.get('designation') as string,
      img: formData.get('img') as string,
      bio: formData.get('bio') as string,
      courseHistory: editingCourses
    }

    try {
      await saveTeacher(teacherData, editingTeacher?.id)
      setTeacherModalOpen(false)
      setEditingTeacher(null)
      // Refresh teachers list
      window.location.reload()
    } catch (error) {
      console.error('Save failed:', error)
      alert('Save failed')
    }
  }

  const openTeacherModal = (teacher?: any) => {
    setEditingTeacher(teacher || null)
    setEditingCourses(teacher?.courseHistory || [])
    setTeacherModalOpen(true)
  }

  const addCourse = () => {
    setEditingCourses([...editingCourses, { id: Date.now().toString(), courseCode: '', courseName: '', semester: '', status: 'taken' }])
  }

  const removeCourse = (index: number) => {
    const newCourses = [...editingCourses]
    newCourses.splice(index, 1)
    setEditingCourses(newCourses)
  }

  const updateCourse = (index: number, field: string, value: string) => {
    const newCourses = [...editingCourses]
    newCourses[index] = { ...newCourses[index], [field]: value }
    setEditingCourses(newCourses)
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t: any) => t.id === teacherId)
    return teacher?.name || 'Unknown'
  }

  const filteredPapers = papers.filter((paper: any) => 
    JSON.stringify(paper).toLowerCase().includes(paperSearch.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500">System administration.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium card-hover"
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            onClick={() => setActiveTab('uploads')}
            className={`border-indigo-500 text-indigo-600 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'uploads' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Uploads 
            <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2.5 rounded-full text-xs">
              {pending.length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('papers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'papers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Papers
          </button>
          <button 
            onClick={() => setActiveTab('faculty')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'faculty' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Faculty
          </button>
        </nav>
      </div>
      
      {/* Pending Uploads */}
      <div className={`bg-white shadow overflow-hidden sm:rounded-md ${activeTab !== 'uploads' ? 'hidden' : ''}`}>
        <ul className="divide-y divide-gray-200">
          {pending.length > 0 ? pending.map((paper: any) => (
            <li key={paper.id} className="px-6 py-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-indigo-600">{paper.courseCode}</span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {paper.semester}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {paper.courseName} 
                  <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline ml-2">
                    PDF
                  </a>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Teacher: {getTeacherName(paper.teacherId)} | Type: {paper.type}
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleApprovePaper(paper.id)}
                  className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleRejectPaper(paper.id)}
                  className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </li>
          )) : (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-check-circle text-green-400 text-4xl mb-3"></i>
              <p className="text-gray-500">No pending uploads.</p>
            </div>
          )}
        </ul>
      </div>

      {/* Manage Papers */}
      <div className={`bg-white shadow overflow-hidden sm:rounded-md ${activeTab !== 'papers' ? 'hidden' : ''}`}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between">
          <h3 className="font-medium">Active Database</h3>
          <input 
            value={paperSearch}
            onChange={(e) => setPaperSearch(e.target.value)}
            placeholder="Search..." 
            className="border rounded px-2 text-sm"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <tbody>
            {filteredPapers.map((paper: any) => (
              <tr key={paper.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {paper.courseCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {paper.courseName}<br/>
                  <span className="text-xs text-gray-400">{paper.semester} | {paper.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleDeletePaper(paper.id)}
                    className="text-red-600 hover:text-red-900 font-bold"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manage Faculty */}
      <div className={`bg-white shadow overflow-hidden sm:rounded-md ${activeTab !== 'faculty' ? 'hidden' : ''}`}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between">
          <h3 className="font-medium">Faculty Members</h3>
          <button 
            onClick={() => openTeacherModal()}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700"
          >
            Add New
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <tbody>
            {teachers.map((teacher: any) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={teacher.img || 'https://via.placeholder.com/40'} alt={teacher.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      <div className="text-sm text-gray-500">{teacher.dept}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openTeacherModal(teacher)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teacher Modal */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl z-10 p-6 m-4 my-8">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Faculty Profile</h3>
              <button onClick={() => setTeacherModalOpen(false)}>
                <i className="fas fa-times text-gray-400"></i>
              </button>
            </div>
            <form onSubmit={handleSaveTeacher} className="space-y-4">
              <input type="hidden" name="id" value={editingTeacher?.id || ''} />
              <input 
                name="name" 
                defaultValue={editingTeacher?.name || ''} 
                placeholder="Full Name" 
                className="w-full border-gray-300 rounded-lg shadow-sm border p-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  name="dept" 
                  defaultValue={editingTeacher?.dept || ''} 
                  className="w-full border-gray-300 rounded-lg border p-2"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <input 
                  name="designation" 
                  defaultValue={editingTeacher?.designation || ''} 
                  placeholder="Designation" 
                  className="w-full border-gray-300 rounded-lg border p-2"
                  required
                />
              </div>
              <input 
                name="img" 
                defaultValue={editingTeacher?.img || ''} 
                placeholder="Image URL" 
                className="w-full border-gray-300 rounded-lg border p-2 bg-gray-50"
                readOnly
              />
              <textarea 
                name="bio" 
                rows={3} 
                defaultValue={editingTeacher?.bio || ''} 
                placeholder="Bio" 
                className="w-full border-gray-300 rounded-lg border p-2"
              />

              {/* Course History Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-700">Course History</h4>
                  <button 
                    type="button"
                    onClick={addCourse}
                    className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100"
                  >
                    + Add Course
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {editingCourses.map((course, index) => (
                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                      <input 
                        value={course.courseCode} 
                        onChange={(e) => updateCourse(index, 'courseCode', e.target.value)}
                        placeholder="Code" 
                        className="w-20 text-xs border rounded p-1"
                      />
                      <input 
                        value={course.courseName} 
                        onChange={(e) => updateCourse(index, 'courseName', e.target.value)}
                        placeholder="Course Name" 
                        className="flex-1 text-xs border rounded p-1"
                      />
                      <input 
                        value={course.semester} 
                        onChange={(e) => updateCourse(index, 'semester', e.target.value)}
                        placeholder="Sem" 
                        className="w-24 text-xs border rounded p-1"
                      />
                      <select 
                        value={course.status} 
                        onChange={(e) => updateCourse(index, 'status', e.target.value)}
                        className="text-xs border rounded p-1"
                      >
                        <option value="taken">Taken</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                      <button 
                        type="button" 
                        onClick={() => removeCourse(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  {editingCourses.length === 0 && (
                    <p className="text-xs text-gray-400 text-center italic">No course history added.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}