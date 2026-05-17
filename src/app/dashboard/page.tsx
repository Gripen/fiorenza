import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[var(--parchment-dark)] bg-white">
        <span className="text-2xl italic font-semibold text-[var(--burgundy)]"
          style={{ fontFamily: 'var(--font-cormorant)' }}>
          Fiorenza
        </span>
        <form action="/auth/signout" method="post">
          <button
            className="text-xs tracking-widest uppercase text-[var(--ink-light)] hover:text-[var(--terracotta)] transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Logga ut
          </button>
        </form>
      </header>

      {/* Innehåll */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-xs mb-3"
          style={{ fontFamily: 'var(--font-inter)' }}>
          ✦ Välkommen
        </p>
        <h1 className="text-5xl font-light italic text-[var(--ink)] mb-10"
          style={{ fontFamily: 'var(--font-cormorant)' }}>
          Hej, {profile?.name ?? 'där'}.
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Kontakter', desc: 'Lägg till och hantera dina kontakter', href: '/dashboard/contacts', icon: '✦' },
            { label: 'Bemärkelsedagar', desc: 'Håll koll på alla viktiga datum', href: '#', icon: '❧' },
            { label: 'Ordrar', desc: 'Se dina beställningar och fakturaunderlag', href: '#', icon: '✉' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className="bg-white border border-[var(--parchment-dark)] px-8 py-10 flex flex-col gap-3 hover:border-[var(--terracotta)] transition-colors group">
              <span className="text-[var(--gold)] text-xl">{item.icon}</span>
              <h2 className="text-xl font-semibold text-[var(--ink)] group-hover:text-[var(--terracotta)] transition-colors"
                style={{ fontFamily: 'var(--font-cormorant)' }}>
                {item.label}
              </h2>
              <p className="text-xs text-[var(--ink-light)] leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}>
                {item.desc}
              </p>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
