import { Link } from 'react-router-dom'

export const WorkspacePageShell = ({ eyebrow, title, description, actions, children }) => (
  <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-300/20 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
    {children}
  </section>
)

export const StatCard = ({ label, value, helper }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    {helper ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{helper}</p> : null}
  </article>
)

export const ActionPanel = ({ title, description, actionLabel, to }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    {to ? (
      <Link
        to={to}
        className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400"
      >
        {actionLabel}
      </Link>
    ) : (
      <button className="mt-4 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
        {actionLabel}
      </button>
    )}
  </article>
)

export const DataList = ({ title, items = [] }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {item}
        </li>
      ))}
    </ul>
  </article>
)
