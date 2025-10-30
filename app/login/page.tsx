'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) setMessage(error.message)
    else {
      setMessage('✅ Logged in!')
      router.push('/') // go to dashboard after login
    }

    setLoading(false)
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('✅ Account created — now sign in!')
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSignIn}
        className="flex flex-col rounded-2xl bg-white/10 p-8 shadow-lg w-full max-w-sm"
      >
        <h1 className="mb-4 text-2xl font-semibold text-center">KSG HQ Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 rounded-xl bg-white/10 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 rounded-xl bg-white/10 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-600 py-2 text-sm font-medium hover:bg-sky-500"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <button
          onClick={handleSignUp}
          type="button"
          disabled={loading}
          className="mt-2 rounded-xl bg-gray-700 py-2 text-sm font-medium hover:bg-gray-600"
        >
          {loading ? 'Creating…' : 'Sign Up'}
        </button>

        {message && <p className="mt-3 text-center text-white/70 text-sm">{message}</p>}
      </form>
    </div>
  )
}
