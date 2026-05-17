'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

type Occasion = {
  id: string
  type: string
  label: string | null
  day: number
  month: number
  year: number | null
  recurring: boolean
}

const OCCASION_TYPES = [
  { value: 'birthday', label: 'Födelsedag' },
  { value: 'nameday', label: 'Namnsdag' },
  { value: 'anniversary', label: 'Årsdag' },
  { value: 'baptism', label: 'Dop' },
  { value: 'custom', label: 'Annat' },
]

const MONTHS = [
  'Januari','Februari','Mars','April','Maj','Juni',
  'Juli','Augusti','September','Oktober','November','December'
]

export default function EditContactPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', postal_code: '', notes: '',
  })
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [showAddOccasion, setShowAddOccasion] = useState(false)
  const [newOccasion, setNewOccasion] = useState({
    type: 'birthday', label: '', day: '', month: '', year: '', recurring: true,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [{ data: contact }, { data: occ }] = await Promise.all([
        supabase.from('contacts').select('*').eq('id', id).single(),
        supabase.from('occasions').select('*').eq('contact_id', id).order('month').order('day'),
      ])
      if (contact) {
        setForm({
          name: contact.name ?? '',
          email: contact.email ?? '',
          phone: contact.phone ?? '',
          address: contact.address ?? '',
          city: contact.city ?? '',
          postal_code: contact.postal_code ?? '',
          notes: contact.notes ?? '',
        })
      }
      setOccasions(occ ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('contacts').update({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      postal_code: form.postal_code || null,
      notes: form.notes || null,
    }).eq('id', id)
    if (error) { setError('Kunde inte spara ändringarna.'); setSaving(false); return }
    router.push('/dashboard/contacts')
  }

  async function handleDelete() {
    if (!confirm('Ta bort kontakten?')) return
    const supabase = createClient()
    await supabase.from('contacts').delete().eq('id', id)
    router.push('/dashboard/contacts')
  }

  async function addOccasion() {
    const day = parseInt(newOccasion.day)
    const month = parseInt(newOccasion.month)
    if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
      setError('Ange ett giltigt dag och månad.')
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('occasions').insert({
      user_id: user.id,
      contact_id: id,
      type: newOccasion.type,
      label: newOccasion.label || null,
      day,
      month,
      year: newOccasion.year ? parseInt(newOccasion.year) : null,
      recurring: newOccasion.recurring,
    }).select().single()

    if (error) { setError('Kunde inte spara datumet.'); return }
    setOccasions(o => [...o, data].sort((a, b) => a.month - b.month || a.day - b.day))
    setShowAddOccasion(false)
    setNewOccasion({ type: 'birthday', label: '', day: '', month: '', year: '', recurring: true })
    setError('')
  }

  async function deleteOccasion(occId: string) {
    const supabase = createClient()
    await supabase.from('occasions').delete().eq('id', occId)
    setOccasions(o => o.filter(x => x.id !== occId))
  }

  function formatOccasion(o: Occasion) {
    const typeLabel = OCCASION_TYPES.find(t => t.value === o.type)?.label ?? o.type
    const label = o.label ? `${o.label}` : typeLabel
    const date = `${o.day} ${MONTHS[o.month - 1]}${o.year ? ` ${o.year}` : ''}`
    return { label, date }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--parchment)] flex items-center justify-center">
        <p className="text-[var(--ink-light)] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>Laddar...</p>
      </div>
    )
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
          ✦ Redigera
        </p>
        <h1 className="text-4xl font-light italic text-[var(--ink)] mb-10"
          style={{ fontFamily: 'var(--font-cormorant)' }}>
          {form.name || 'Kontakt'}
        </h1>

        {/* Kontaktformulär */}
        <form onSubmit={handleSubmit} className="bg-white border border-[var(--parchment-dark)] px-10 py-10 flex flex-col gap-5 mb-6">
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
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)] resize-none"
              style={{ fontFamily: 'var(--font-inter)' }} />
          </div>

          {error && <p className="text-sm text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-inter)' }}>{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleDelete}
              className="border border-[var(--terracotta)] text-[var(--terracotta)] px-5 py-3 text-xs tracking-widest uppercase hover:bg-[var(--terracotta)] hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}>
              Ta bort
            </button>
            <Link href="/dashboard/contacts"
              className="flex-1 text-center border border-[var(--parchment-dark)] py-3 text-xs tracking-widest uppercase text-[var(--ink-light)] hover:border-[var(--terracotta)] transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}>
              Avbryt
            </Link>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[var(--burgundy)] text-[var(--parchment)] py-3 text-xs tracking-widest uppercase hover:bg-[var(--burgundy-light)] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--font-inter)' }}>
              {saving ? 'Sparar...' : 'Spara'}
            </button>
          </div>
        </form>

        {/* Bemärkelsedagar */}
        <div className="bg-white border border-[var(--parchment-dark)] px-10 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}>
              Bemärkelsedagar
            </h2>
            <button onClick={() => { setShowAddOccasion(v => !v); setError('') }}
              className="text-xs tracking-widest uppercase text-[var(--terracotta)] hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'var(--font-inter)' }}>
              {showAddOccasion ? 'Avbryt' : '+ Lägg till'}
            </button>
          </div>

          {occasions.length === 0 && !showAddOccasion && (
            <p className="text-xs text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-inter)' }}>
              Inga datum tillagda än.
            </p>
          )}

          {occasions.length > 0 && (
            <div className="divide-y divide-[var(--parchment-dark)] mb-4">
              {occasions.map(o => {
                const { label, date } = formatOccasion(o)
                return (
                  <div key={o.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-[var(--ink)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {label}
                      </p>
                      <p className="text-xs text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-inter)' }}>
                        {date}
                      </p>
                    </div>
                    <button onClick={() => deleteOccasion(o.id)}
                      className="text-xs text-[var(--ink-light)] hover:text-[var(--terracotta)] transition-colors"
                      style={{ fontFamily: 'var(--font-inter)' }}>
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {showAddOccasion && (
            <div className="border-t border-[var(--parchment-dark)] pt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
                  style={{ fontFamily: 'var(--font-inter)' }}>Typ</label>
                <select value={newOccasion.type}
                  onChange={e => setNewOccasion(n => ({ ...n, type: e.target.value }))}
                  className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
                  style={{ fontFamily: 'var(--font-inter)' }}>
                  {OCCASION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {newOccasion.type === 'custom' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
                    style={{ fontFamily: 'var(--font-inter)' }}>Benämning</label>
                  <input type="text" value={newOccasion.label}
                    onChange={e => setNewOccasion(n => ({ ...n, label: e.target.value }))}
                    placeholder="t.ex. Studentdag"
                    className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
                    style={{ fontFamily: 'var(--font-inter)' }} />
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
                    style={{ fontFamily: 'var(--font-inter)' }}>Dag</label>
                  <input type="number" min={1} max={31} value={newOccasion.day}
                    onChange={e => setNewOccasion(n => ({ ...n, day: e.target.value }))}
                    placeholder="DD"
                    className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
                    style={{ fontFamily: 'var(--font-inter)' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
                    style={{ fontFamily: 'var(--font-inter)' }}>Månad</label>
                  <select value={newOccasion.month}
                    onChange={e => setNewOccasion(n => ({ ...n, month: e.target.value }))}
                    className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
                    style={{ fontFamily: 'var(--font-inter)' }}>
                    <option value="">—</option>
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs tracking-widest uppercase text-[var(--ink-light)]"
                    style={{ fontFamily: 'var(--font-inter)' }}>År (opt.)</label>
                  <input type="number" min={1900} max={2025} value={newOccasion.year}
                    onChange={e => setNewOccasion(n => ({ ...n, year: e.target.value }))}
                    placeholder="ÅÅÅÅ"
                    className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
                    style={{ fontFamily: 'var(--font-inter)' }} />
                </div>
              </div>
              <button onClick={addOccasion}
                className="bg-[var(--burgundy)] text-[var(--parchment)] py-3 text-xs tracking-widest uppercase hover:bg-[var(--burgundy-light)] transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}>
                Spara datum
              </button>
            </div>
          )}
        </div>
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
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="border border-[var(--parchment-dark)] px-4 py-3 text-sm text-[var(--ink)] bg-[var(--parchment)] focus:outline-none focus:border-[var(--terracotta)]"
        style={{ fontFamily: 'var(--font-inter)' }} />
    </div>
  )
}
