export const PublicPageShell = ({ title, subtitle, children }) => (
  <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <header className="mb-8 rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-lg shadow-slate-300/20 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>
    </header>
    {children}
  </section>
)

export const PublicCard = ({ children, className = '' }) => (
  <article className={`rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/85 ${className}`}>
    {children}
  </article>
)
