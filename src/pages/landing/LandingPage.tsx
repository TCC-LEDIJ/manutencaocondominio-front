import { ArrowRight, BellRing, FileText, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: LayoutGrid,
    title: 'Cadastro organizado',
    description:
      'Elevadores, bombas, SPDA e todos os ativos do condomínio em um só lugar, com histórico completo.',
  },
  {
    icon: BellRing,
    title: 'Alertas antecipados',
    description:
      'Notificações em D‑15 e D‑7 antes de cada vencimento. Nada cai no esquecimento.',
  },
  {
    icon: FileText,
    title: 'Laudos centralizados',
    description:
      'Cada inspeção com seu laudo, rastreável e acessível — para o síndico e para os moradores.',
  },
]

const stats = [
  { value: '100%', label: 'das manutenções rastreadas' },
  { value: 'D‑15', label: 'de antecedência nos alertas' },
  { value: '0', label: 'planilhas necessárias' },
]

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-surface bg-hero-grid">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-10 border-b border-black/10 bg-[#f4f3ef]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a6b45]">
              <HomeIcon />
            </span>
            <span className="font-serif text-xl tracking-tight text-[#0f1c14]">Alvenar</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm text-[#6b7d6f] transition hover:bg-black/5 hover:text-[#0f1c14]"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#2a6b45] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0f1c14]"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:px-10 md:pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2a6b45]/20 bg-[#e8f2ec] px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2a6b45]" />
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#2a6b45]">
            Conformidade NBR 5674
          </span>
        </div>

        <h1 className="mb-5 max-w-3xl font-serif text-5xl font-normal leading-[1.05] text-[#0f1c14] md:text-7xl">
          Infraestrutura do condomínio{' '}
          <em className="italic text-[#2a6b45]">sempre em dia.</em>
        </h1>

        <p className="mb-10 max-w-lg text-lg font-light leading-relaxed text-[#6b7d6f]">
          Cadastre equipamentos, receba alertas antes do vencimento e centralize
          todos os laudos — sem planilha, sem esquecimento.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#2a6b45] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0f1c14]"
          >
            Começar agora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/60 px-6 py-3 text-sm font-medium text-[#2d3d33] transition hover:border-black/20 hover:bg-white"
          >
            Ver demonstração
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <div className="border-y border-black/10">
        <div className="mx-auto grid max-w-6xl divide-y divide-black/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {features.map((f) => (
            <article
              key={f.title}
              className="group px-8 py-10 transition-colors hover:bg-white md:px-10"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f2ec]">
                <f.icon className="h-5 w-5 stroke-[#2a6b45]" strokeWidth={1.75} />
              </div>
              <h3 className="mb-2 font-serif text-xl font-normal">{f.title}</h3>
              <p className="text-sm font-light leading-relaxed text-[#6b7d6f]">
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* ── Social proof ── */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <div className="flex flex-wrap items-center gap-10">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-10">
              <div>
                <p className="font-serif text-4xl text-[#0f1c14]">{s.value}</p>
                <p className="mt-0.5 text-xs font-light text-[#6b7d6f]">{s.label}</p>
              </div>
              {i < stats.length - 1 && (
                <div className="h-10 w-px bg-black/10" />
              )}
            </div>
          ))}

          <div className="min-w-[240px] flex-1 border-l-2 border-[#2a6b45] pl-5">
            <p className="font-serif text-base italic leading-relaxed text-[#2d3d33]">
              "Chega de descobrir o vencimento no dia da vistoria do bombeiro."
            </p>
            <span className="mt-1 block text-xs font-light text-[#6b7d6f]">
              O problema que o Alvenar resolve.
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="bg-[#0f1c14] px-6 py-20 text-center md:px-10">
        <h2 className="mb-3 font-serif text-4xl font-normal text-white md:text-5xl">
          Seu condomínio em dia,<br />a partir de hoje.
        </h2>
        <p className="mb-8 text-sm font-light text-white/50">
          Cadastro gratuito. Sem contrato, sem cartão de crédito.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-medium text-[#0f1c14] transition hover:bg-[#e8f2ec]"
        >
          Criar conta grátis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/10 bg-[#f4f3ef] px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs font-light text-[#6b7d6f]">
          <span>© 2026 Alvenar</span>
          <span>Gestão de manutenção condominial</span>
        </div>
      </footer>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}