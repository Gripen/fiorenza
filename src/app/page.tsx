export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--parchment-dark)]">
        <span
          className="text-3xl font-semibold italic tracking-wide text-[var(--burgundy)]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Fiorenza
        </span>
        <div
          className="flex gap-8 items-center text-sm text-[var(--ink-light)] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <a href="#" className="hover:text-[var(--terracotta)] transition-colors">Hur det fungerar</a>
          <a href="#" className="hover:text-[var(--terracotta)] transition-colors">Priser</a>
          <a href="#" className="bg-[var(--burgundy)] text-[var(--parchment)] px-5 py-2 hover:bg-[var(--burgundy-light)] transition-colors">
            Kom igång
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <p
          className="text-[var(--gold)] tracking-[0.3em] uppercase text-xs mb-6"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ✦ Glöm aldrig ett viktigt datum ✦
        </p>
        <h1
          className="text-6xl md:text-8xl font-light italic text-[var(--ink)] leading-tight mb-6"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Fira de du älskar
          <br />
          <span className="text-[var(--terracotta)]">med blommor och hjärta.</span>
        </h1>
        <p
          className="text-[var(--ink-light)] max-w-xl mt-4 mb-10 text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Fiorenza påminner dig om födelsedagar och namnsdagar — och gör det enkelt
          att skicka en bukett eller en personlig hälsning till precis rätt person.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="#"
            className="bg-[var(--terracotta)] text-[var(--parchment)] px-8 py-4 text-sm tracking-widest uppercase hover:bg-[var(--terracotta-dark)] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Skapa konto
          </a>
          <a
            href="#"
            className="border border-[var(--ink-light)] text-[var(--ink)] px-8 py-4 text-sm tracking-widest uppercase hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Se hur det fungerar
          </a>
        </div>
      </section>

      {/* Ornamental divider */}
      <div className="flex items-center justify-center py-4 text-[var(--gold)] text-lg opacity-60">
        ⸻ ❧ ⸻
      </div>

      {/* Feature cards */}
      <section className="grid md:grid-cols-3 gap-px bg-[var(--parchment-dark)] border-t border-b border-[var(--parchment-dark)]">
        {[
          {
            icon: "✦",
            title: "Påminnelser i tid",
            body: "Aldrig mer ett missat datum. Fiorenza skickar påminnelse i god tid — du väljer hur långt innan.",
          },
          {
            icon: "❧",
            title: "Blommor levererade",
            body: "Beställ en bukett direkt i appen. Lokala blomsterhandlare levererar inom Malmö och Skåne.",
          },
          {
            icon: "✉",
            title: "Personlig hälsning",
            body: "Skriv en hälsning och välj ett vackert kort. Skickas som mail eller meddelande — eller med blombukettet.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-[var(--parchment)] px-10 py-12 flex flex-col gap-4">
            <span className="text-[var(--gold)] text-2xl">{f.icon}</span>
            <h3
              className="text-2xl font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {f.title}
            </h3>
            <p
              className="text-[var(--ink-light)] text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {f.body}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 text-xs text-[var(--ink-light)] tracking-widest uppercase"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        © 2026 Fiorenza · Malmö, Sverige
      </footer>

    </main>
  );
}
