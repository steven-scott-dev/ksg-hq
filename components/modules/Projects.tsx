'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Save, Trash2 } from 'lucide-react'

export default function Projects({ user }: { user: any }) {
  const [projects, setProjects] = useState<any[]>([])
  const [name, setName] = useState('')
  const [status, setStatus] = useState('Active')

  useEffect(() => { if (user) fetchProjects() }, [user])

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setProjects(data || [])
  }

  async function addProject() {
    if (!name.trim()) return
    await supabase.from('projects').insert({ user_id: user.id, name, status })
    setName(''); setStatus('Active'); fetchProjects()
  }

  async function updateProgress(id: string, val: number) {
    await supabase.from('projects').update({ progress: val }).eq('id', id)
  }

  async function deleteProject(id: string) {
    await supabase.from('projects').delete().eq('id', id)
    setProjects((x) => x.filter((p) => p.id !== id))
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-1">
        <h2 className="mb-3 text-xl font-semibold">Add Project</h2>
        <input className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-2"
          placeholder="Project name" value={name} onChange={(e)=>setName(e.target.value)} />
        <select className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-2"
          value={status} onChange={(e)=>setStatus(e.target.value)}>
          {['Active','Planning','On Hold','Completed'].map(s=><option key={s}>{s}</option>)}
        </select>
        <button onClick={addProject}
          className="flex items-center gap-1 rounded-xl bg-sky-600 px-3 py-1 text-sm hover:bg-sky-500">
          <Plus size={14}/>Add
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
        <h2 className="mb-3 text-xl font-semibold">Your Projects</h2>
        {projects.length===0 && <p className="text-white/60">No projects yet.</p>}
        <div className="grid gap-3">
          {projects.map(p=>(
            <div key={p.id} className="rounded-xl bg-white/5 p-3">
              <div className="flex justify-between mb-1">
                <span>{p.name}</span>
                <div className="flex gap-2">
                  <span className="text-xs">{p.status}</span>
                  <button onClick={()=>deleteProject(p.id)}
                    className="rounded bg-rose-600/70 p-1 hover:bg-rose-500">
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
              <input type="range" min={0} max={100} value={p.progress||0}
                onChange={e=>updateProgress(p.id,parseInt(e.target.value))}
                className="w-full"/>
              <div className="text-xs text-white/60">{p.progress||0}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
