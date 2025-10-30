'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2 } from 'lucide-react'

export default function Shortcuts({ user }: { user: any }) {
  const [items,setItems]=useState<any[]>([])
  const [name,setName]=useState('')
  const [schedule,setSchedule]=useState('Daily 09:00')

  useEffect(()=>{if(user)load()},[user])
  async function load(){const {data}=await supabase.from('automations').select('*').eq('user_id',user.id);setItems(data||[])}
  async function add(){await supabase.from('automations').insert({user_id:user.id,name,schedule});setName('');load()}
  async function del(id:string){await supabase.from('automations').delete().eq('id',id);setItems(x=>x.filter(i=>i.id!==id))}

  return(
  <div className="space-y-3">
    <div className="flex gap-2">
      <input className="flex-1 rounded bg-white/5 p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
      <input className="w-40 rounded bg-white/5 p-2" value={schedule} onChange={e=>setSchedule(e.target.value)}/>
      <button onClick={add} className="rounded bg-sky-600 px-3 py-1 text-sm"><Plus size={14}/></button>
    </div>
    {items.map(i=>(
      <div key={i.id} className="flex justify-between rounded bg-white/5 p-2">
        <span>{i.name} · {i.schedule}</span>
        <button onClick={()=>del(i.id)} className="rounded bg-rose-600/70 p-1"><Trash2 size={12}/></button>
      </div>
    ))}
  </div>)
}
