import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center justify-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl shadow-slate-300/30 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">Access Restricted</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">You do not have permission</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          This workspace is available only for specific account roles. Continue to your dashboard or explore public pages.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Unauthorized
