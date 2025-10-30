'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Upload, Trash2 } from 'lucide-react'

export default function Files({ user }: { user: any }) {
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{ if(user) loadFiles() },[user])

  async function loadFiles(){
    const { data, error } = await supabase.from('files').select('*').eq('user_id',user.id)
    if(!error) setFiles(data||[])
  }

  async function handleUpload(e:any){
    const file=e.target.files[0]; if(!file||!user) return
    setUploading(true)
    const { data, error } = await supabase.storage.from('uploads').upload(`${user.id}/${file.name}`, file)
    if(error){ alert(error.message); setUploading(false); return }
    const url = supabase.storage.from('uploads').getPublicUrl(`${user.id}/${file.name}`).data.publicUrl
    await supabase.from('files').insert({
      user_id:user.id, name:file.name, size:`${(file.size/1024).toFixed(1)} KB`,
      path:`/${user.id}`, type:file.type, url
    })
    setUploading(false); loadFiles()
  }

  async function deleteFile(id:string,url:string){
    const path=url.split('/').slice(-2).join('/')
    await supabase.storage.from('uploads').remove([path])
    await supabase.from('files').delete().eq('id',id)
    setFiles(x=>x.filter(f=>f.id!==id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input type="file" onChange={handleUpload}/>
        {uploading && <span className="text-white/60 text-sm">Uploading…</span>}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {files.map(f=>(
          <div key={f.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
            <a href={f.url} target="_blank" className="text-sky-400 underline">{f.name}</a>
            <button onClick={()=>deleteFile(f.id,f.url)}
              className="rounded bg-rose-600/70 p-1 hover:bg-rose-500"><Trash2 size={14}/></button>
          </div>
        ))}
        {files.length===0 && <p className="text-white/60">No files yet.</p>}
      </div>
    </div>
  )
}
