'use client'

import { useSession } from '@supabase/auth-helpers-react'
import KsgHq from '@/components/KsgHq'
import Login from './login/page'

export default function Home() {
  const session = useSession()
  return session ? <KsgHq /> : <Login />
}
