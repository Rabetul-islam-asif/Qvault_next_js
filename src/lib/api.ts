import { supabase } from './supabase'

export async function uploadToCatbox(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('reqtype', 'fileupload')
  formData.append('fileToUpload', file)
  
  const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://catbox.moe/user/api.php'), {
    method: 'POST',
    body: formData
  })
  
  const url = await response.text()
  if (!url.startsWith('http')) {
    throw new Error('Catbox Error')
  }
  
  return url.trim()
}

export async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await fetch(`https://api.imgbb.com/1/upload?key=659c558f44d89bffc201c4e258836605`, {
    method: 'POST',
    body: formData
  })
  
  const data = await response.json()
  if (data.success) {
    return data.data.url
  }
  
  throw new Error('Image upload failed')
}

export async function fetchTeachers() {
  const { data } = await supabase.from('teachers').select('*')
  return data || []
}

export async function fetchPapers() {
  const { data } = await supabase.from('papers').select('*')
  return data || []
}

export async function fetchPendingPapers() {
  const { data } = await supabase.from('pending_papers').select('*')
  return data || []
}

export async function submitPendingPaper(paperData: any) {
  const { data, error } = await supabase.from('pending_papers').insert(paperData)
  if (error) throw error
  return data
}

export async function approvePaper(id: string, paperData: any) {
  const { id: _, uploadedAt: __, ...dataToInsert } = paperData
  
  await supabase.from('papers').insert(dataToInsert)
  await supabase.from('pending_papers').delete().eq('id', id)
}

export async function rejectPaper(id: string) {
  await supabase.from('pending_papers').delete().eq('id', id)
}

export async function deletePaper(id: string) {
  await supabase.from('papers').delete().eq('id', id)
}

export async function saveTeacher(teacherData: any, id?: string) {
  if (id) {
    await supabase.from('teachers').update(teacherData).eq('id', id)
  } else {
    await supabase.from('teachers').insert(teacherData)
  }
}

export async function deleteTeacher(id: string) {
  await supabase.from('teachers').delete().eq('id', id)
}