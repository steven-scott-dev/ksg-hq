'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type User = { id: string }

export default function Projects({ user }: { user: User | null }) {
  const [projects, setProjects] = useState<any[]>([])
  const [name, setName] = useState('')
  const [status, setStatus] = useState('Active')

  useEffect(() => {
    if (user?.id) fetchProjects()
  }, [user])

  async function fetchProjects() {
    if (!user?.id) return
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
    if (!error && data) setProjects(data)
  }

  async function addProject() {
    if (!user?.id || !name.trim()) return
    await supabase.from('projects').insert({ user_id: user.id, name, status })
    setName('')
    setStatus('Active')
    fetchProjects()
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project…"
          className="bg-slate-800 text-white p-2 rounded flex-1"
        />
        <button
          onClick={addProject}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Add
        </button>
      </div>

      <ul>
        {projects.map((p) => (
          <li key={p.id} className="border-b border-slate-700 py-2">
            {p.name} — {p.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
