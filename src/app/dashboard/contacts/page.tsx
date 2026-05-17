import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      <header className="flex items-center justify-between px-8 py-5 border-b border-[var(--parchment-dark)] bg-white">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-2xl italic font-semibold text-[var(--burgundy)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}>
            Fiorenza
          </Link>
          <span className="text-[var(--parchment-dark)]">|</span>
          <span className="text-sm text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-inter)' }}>
            Kontakter
          </span>
        </div>
        <form action="/auth/signout" method="post">
          <button className="text-xs tracking-widest uppercase text-[var(--ink-light)] hover:text-[var(--terracotta)] transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}>
            Logga ut
          </button>
        </form>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-xs mb-2"
              style={{ fontFamily: 'var(--font-inter)' }}>
              ✦ Kontakter
            </p>
            <h1 className="text-4xl font-light italic text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}>
              {contacts?.length ?? 0} kontakter
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/contacts/import"
              className="border border-[var(--parchment-dark)] px-5 py-2.5 text-xs tracking-widest uppercase text-[var(--ink-light)] hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}>
              Importera CSV
            </Link>
            <Link href="/dashboard/contacts/new"
              className="bg-[var(--burgundy)] text-[var(--parchment)] px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-[var(--burgundy-light)] transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}>
              + Lägg till
            </Link>
          </div>
        </div>

        {!contacts || contacts.length === 0 ? (
          <div className="bg-white border border-[var(--parchment-dark)] px-10 py-16 text-center">
            <div className="text-4xl text-[var(--gold)] opacity-40 mb-4">❧</div>
            <p className="text-[var(--ink-light)] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
              Inga kontakter ännu. Lägg till din första eller importera från CSV.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[var(--parchment-dark)] divide-y divide-[var(--parchment-dark)]">
            {contacts.map(contact => (
              <Link key={contact.id} href={`/dashboard/contacts/${contact.id}/edit`}
                className="flex items-center justify-between px-8 py-4 hover:bg-[var(--parchment)] transition-colors group">
                <div>
                  <p className="text-base font-semibold text-[var(--ink)] group-hover:text-[var(--terracotta)] transition-colors"
                    style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {contact.name}
                  </p>
                  <p className="text-xs text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                    {[contact.email, contact.phone].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="text-xs text-[var(--ink-light)] text-right" style={{ fontFamily: 'var(--font-inter)' }}>
                  {contact.city && <p>{contact.city}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
