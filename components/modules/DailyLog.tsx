'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Save, Trash2 } from 'lucide-react'

export default function DailyLog({ user }: { user: any }) {
  const [logs, setLogs] = useState<any[]>([])
  const [note, setNote] = useState('')
  const [mood, setMood] = useState('')
  const [loading, setLoading] = useState(false)

  // 🧩 Load logs on mount
  useEffect(() => {
    if (!user) return
    fetchLogs()
  }, [user])

  async function fetchLogs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date_iso', { ascending: false })
      .limit(10)
    if (error) console.error('Load error', error)
    else setLogs(data || [])
    setLoading(false)
  }

  // ➕ Add new log
  async function addLog() {
    if (!note.trim() && !mood.trim()) return
    const { error } = await supabase.from('logs').insert({
      user_id: user.id,
      mood,
      note,
    })
    if (error) return alert('Insert error: ' + error.message)
    setNote('')
    setMood('')
    fetchLogs()
  }

  // ❌ Delete log
  async function deleteLog(id: string) {
    const { error } = await supabase.from('logs').delete().eq('id', id)
    if (error) return alert('Delete error: ' + error.message)
    setLogs((x) => x.filter((l) => l.id !== id))
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* ✏️ New Entry */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-md md:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Entry</h2>
          <button
            onClick={addLog}
            className="flex items-center gap-1 rounded-xl bg-sky-600 px-3 py-1 text-sm hover:bg-sky-500"
          >
            <Save size={14} /> Save
          </button>
        </div>
        <input
          className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Mood (e.g. focused, tired)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <textarea
          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="What happened today?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* 📋 Recent Entries */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-md">
        <h2 className="mb-2 text-lg font-semibold">Recent Logs</h2>
        {loading && <p className="text-sm text-white/60">Loading…</p>}
        {!loading && logs.length === 0 && (
          <p className="text-sm text-white/60">No entries yet.</p>
        )}
        <div className="space-y-2">
          {logs.map((l) => (
            <div
              key={l.id}
              className="rounded-lg bg-white/5 p-2 text-sm text-white/80"
            >
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>
                  {new Date(l.date_iso).toLocaleDateString()} · 
                  {l.mood || '—'}
                </span>
                <button
                  onClick={() => deleteLog(l.id)}
                  className="rounded-lg bg-rose-600/70 p-1 hover:bg-rose-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div>{l.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
