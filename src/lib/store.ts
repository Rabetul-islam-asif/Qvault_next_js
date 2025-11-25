import { create } from 'zustand'

interface Teacher {
  id: string
  name: string
  dept: string
  designation: string
  img?: string
  bio?: string
}

interface Paper {
  id: string
  courseCode: string
  courseName: string
  semester: string
  exam: string
  dept: string
  type: 'theory' | 'lab'
  teacherId: string
  fileUrl: string
  uploadedAt?: string
}

interface PendingPaper {
  id: string
  courseCode: string
  courseName: string
  semester: string
  exam: string
  dept: string
  type: 'theory' | 'lab'
  teacherId: string
  fileUrl: string
}

interface Filters {
  search: string
  dept: string
  season: string
  year: string
  type: string
}

interface AppState {
  teachers: Teacher[]
  papers: Paper[]
  pending: PendingPaper[]
  user: string | null
  filters: Filters
  currentView: string
  setTeachers: (teachers: Teacher[]) => void
  setPapers: (papers: Paper[]) => void
  setPending: (pending: PendingPaper[]) => void
  setUser: (user: string | null) => void
  setFilters: (filters: Partial<Filters>) => void
  setCurrentView: (view: string) => void
  resetFilters: () => void
}

export const useAppStore = create<AppState>((set) => ({
  teachers: [],
  papers: [],
  pending: [],
  user: null,
  filters: { search: '', dept: '', season: '', year: '', type: '' },
  currentView: 'home',
  
  setTeachers: (teachers) => set({ teachers }),
  setPapers: (papers) => set({ papers }),
  setPending: (pending) => set({ pending }),
  setUser: (user) => set({ user }),
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  setCurrentView: (currentView) => set({ currentView }),
  resetFilters: () => set({ 
    filters: { search: '', dept: '', season: '', year: '', type: '' } 
  }),
}))