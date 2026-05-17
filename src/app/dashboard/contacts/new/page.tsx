'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function NewContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', postal_code: '', notes: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error } = await supabase.from('contacts').insert({
      user_id: user.id,
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      postal_code: form.postal_code || null,
      notes: form.notes || null,
    })

    if (error) {
      setError('Kunde inte spara kontakten.')
      setLoading(false)
      return
    }
    router.push('/dashboard/contacts')
  }

  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      <header className="flex items-center justify-between px-8 py-5 border-b border-[var(--parchment-dark)] bg-white">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-2xl italic font-semibold text-[var(--burgundy)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}>
            Fiorenza
          </Link>
          <span className="text-[var(--parchment-dark)]">|</span>
          <Link href="/dashboard/contacts" className="text-sm text-[var(--ink-light)] hover:text-[var(--terracotta)] transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}>
            Kontakter
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-xs mb-2"
          style={{ fontFamily: 'var(--font-inter)' }}>
          ✦ Ny kontakt
        </p>
        <h1 className="text-4xl font-light italic text-[var(--ink)] mb-10"
          style={{ fontFamily: 'var(--font-cormorant)' }}>
          Lägg till kontakt
        </h1>

        <form onSubmit={handleSubmit} className="bg-white border border-[var(--parchment-dark)] px-10 py-10 flex flex-col gap-5">
          <Field label="Namn *" value={form.name} onChange={v => set('name', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="E-post" type="email" value={form.email} onChange={v => set('email', v)} />
            <Field label="Telefon" type="tel" value={form.phone} onChange={v => set('phone', v)} />
          </div>
          <Field label="Adress" value={form.address} onChange={v => set('address', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stad" value={form.city} onChange={v => set('city', v)} />
            <Field label="Postnummer" value={form.postal_code} onChange={v => set('postal_code', v)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
              style={{ fontFamily: 'var(--font-inter)' }}>Anteckningar</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)] resize-none"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-inter)' }}>{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/contacts"
              className="flex-1 text-center border border-[var(--parchment-dark)] py-3 text-xs tracking-widest uppercase text-[var(--ink-light)] hover:border-[var(--terracotta)] transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}>
              Avbryt
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 bg-[var(--burgundy)] text-[var(--parchment)] py-3 text-xs tracking-widest uppercase hover:bg-[var(--burgundy-light)] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--font-inter)' }}>
              {loading ? 'Sparar...' : 'Spara kontakt'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
        style={{ fontFamily: 'var(--font-inter)' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
        style={{ fontFamily: 'var(--font-inter)' }}
      />
    </div>
  )
}
