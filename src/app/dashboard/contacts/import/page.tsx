'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

type Row = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  notes: string
}

const COLUMNS = ['name', 'email', 'phone', 'address', 'city', 'postal_code', 'notes']
const COLUMN_LABELS: Record<string, string> = {
  name: 'Namn', email: 'E-post', phone: 'Telefon',
  address: 'Adress', city: 'Stad', postal_code: 'Postnummer', notes: 'Anteckningar',
}

function parseCSV(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h =>
    h.trim().toLowerCase()
      .replace(/^"(.*)"$/, '$1')
      .replace(/\s+/g, '_')
      .replace('namn', 'name')
      .replace('e-post', 'email')
      .replace('epost', 'email')
      .replace('telefon', 'phone')
      .replace('adress', 'address')
      .replace('stad', 'city')
      .replace('postnummer', 'postal_code')
      .replace('anteckningar', 'notes')
  )

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'))
    const row: Partial<Row> = {}
    headers.forEach((h, i) => {
      if (COLUMNS.includes(h)) row[h as keyof Row] = values[i] ?? ''
    })
    return {
      name: row.name ?? '',
      email: row.email ?? '',
      phone: row.phone ?? '',
      address: row.address ?? '',
      city: row.city ?? '',
      postal_code: row.postal_code ?? '',
      notes: row.notes ?? '',
    }
  }).filter(r => r.name.length > 0)
}

export default function ImportContactsPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length === 0) {
        setError('Filen verkar tom eller har fel format.')
        setRows([])
      } else {
        setError('')
        setRows(parsed)
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  function removeRow(i: number) {
    setRows(r => r.filter((_, idx) => idx !== i))
  }

  async function handleImport() {
    if (rows.length === 0) return
    setImporting(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error } = await supabase.from('contacts').insert(
      rows.map(r => ({
        user_id: user.id,
        name: r.name,
        email: r.email || null,
        phone: r.phone || null,
        address: r.address || null,
        city: r.city || null,
        postal_code: r.postal_code || null,
        notes: r.notes || null,
      }))
    )

    if (error) {
      setError('Något gick fel vid importen.')
      setImporting(false)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/dashboard/contacts'), 1500)
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-xs mb-2"
          style={{ fontFamily: 'var(--font-inter)' }}>
          ✦ Importera
        </p>
        <h1 className="text-4xl font-light italic text-[var(--ink)] mb-10"
          style={{ fontFamily: 'var(--font-cormorant)' }}>
          Importera från CSV
        </h1>

        {/* Format-info */}
        <div className="bg-white border border-[var(--parchment-dark)] px-8 py-6 mb-6">
          <p className="text-xs tracking-widest uppercase text-[var(--ink-light)] mb-3"
            style={{ fontFamily: 'var(--font-inter)' }}>
            Förväntat format
          </p>
          <p className="text-xs text-[var(--ink-light)] font-mono bg-[var(--parchment)] px-4 py-3 border border-[var(--parchment-dark)]">
            name,email,phone,address,city,postal_code,notes
          </p>
          <p className="text-xs text-[var(--ink-light)] mt-3" style={{ fontFamily: 'var(--font-inter)' }}>
            Kolumnnamnen kan vara på svenska (Namn, E-post, Telefon...). Bara Namn är obligatoriskt.
          </p>
        </div>

        {/* Filuppladdning */}
        {rows.length === 0 && !done && (
          <div
            className="bg-white border-2 border-dashed border-[var(--parchment-dark)] px-10 py-16 text-center cursor-pointer hover:border-[var(--terracotta)] transition-colors"
            onClick={() => fileRef.current?.click()}>
            <div className="text-3xl text-[var(--gold)] opacity-40 mb-4">✦</div>
            <p className="text-base text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Klicka för att välja CSV-fil
            </p>
            <p className="text-xs text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-inter)' }}>
              eller dra och släpp filen här
            </p>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          </div>
        )}

        {error && (
          <p className="text-sm text-[var(--terracotta)] mt-4" style={{ fontFamily: 'var(--font-inter)' }}>{error}</p>
        )}

        {/* Förhandsgranskning */}
        {rows.length > 0 && !done && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-inter)' }}>
                {rows.length} kontakter hittade — granska och ta bort de du inte vill importera.
              </p>
              <button onClick={() => { setRows([]); if (fileRef.current) fileRef.current.value = '' }}
                className="text-xs text-[var(--ink-light)] hover:text-[var(--terracotta)] underline"
                style={{ fontFamily: 'var(--font-inter)' }}>
                Byt fil
              </button>
            </div>

            <div className="bg-white border border-[var(--parchment-dark)] overflow-x-auto mb-6">
              <table className="w-full text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                <thead className="bg-[var(--parchment)] border-b border-[var(--parchment-dark)]">
                  <tr>
                    {['Namn', 'E-post', 'Telefon', 'Stad', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[var(--ink-light)] tracking-widest uppercase font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--parchment-dark)]">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-[var(--parchment)]">
                      <td className="px-4 py-3 text-[var(--ink)] font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-[var(--ink-light)]">{row.email}</td>
                      <td className="px-4 py-3 text-[var(--ink-light)]">{row.phone}</td>
                      <td className="px-4 py-3 text-[var(--ink-light)]">{row.city}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => removeRow(i)}
                          className="text-[var(--terracotta)] hover:opacity-70 transition-opacity">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/contacts"
                className="flex-1 text-center border border-[var(--parchment-dark)] py-3 text-xs tracking-widest uppercase text-[var(--ink-light)] hover:border-[var(--terracotta)] transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}>
                Avbryt
              </Link>
              <button onClick={handleImport} disabled={importing}
                className="flex-1 bg-[var(--burgundy)] text-[var(--parchment)] py-3 text-xs tracking-widest uppercase hover:bg-[var(--burgundy-light)] transition-colors disabled:opacity-50"
                style={{ fontFamily: 'var(--font-inter)' }}>
                {importing ? 'Importerar...' : `Importera ${rows.length} kontakter`}
              </button>
            </div>
          </>
        )}

        {done && (
          <div className="bg-white border border-[var(--parchment-dark)] px-10 py-16 text-center">
            <div className="text-4xl text-[var(--gold)] mb-4">❧</div>
            <p className="text-lg italic text-[var(--ink)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Import klar — tar dig tillbaka...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
