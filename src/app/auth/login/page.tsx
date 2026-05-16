'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Fel e-post eller lösenord.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--parchment)] px-4">
      <Link href="/" className="mb-10 text-4xl italic font-semibold text-[var(--burgundy)]"
        style={{ fontFamily: 'var(--font-cormorant)' }}>
        Fiorenza
      </Link>

      <div className="w-full max-w-md border border-[var(--parchment-dark)] bg-white px-10 py-12">
        <h1 className="text-3xl font-semibold text-[var(--ink)] mb-1"
          style={{ fontFamily: 'var(--font-cormorant)' }}>
          Välkommen tillbaka
        </h1>
        <p className="text-sm text-[var(--ink-light)] mb-8"
          style={{ fontFamily: 'var(--font-inter)' }}>
          Logga in på ditt konto
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
              style={{ fontFamily: 'var(--font-inter)' }}>
              E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
              style={{ fontFamily: 'var(--font-inter)' }}>
              Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-inter)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--burgundy)] text-[var(--parchment)] py-3 text-sm tracking-widest uppercase hover:bg-[var(--burgundy-light)] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--ink-light)]"
          style={{ fontFamily: 'var(--font-inter)' }}>
          Inget konto?{' '}
          <Link href="/auth/register" className="text-[var(--terracotta)] hover:underline">
            Skapa ett här
          </Link>
        </p>
      </div>

      <div className="mt-6 text-[var(--gold)] opacity-50">❧</div>
    </div>
  )
}
