import { useMemo, useState } from 'react'
import { DataList, WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'

const ScorerConsole = () => {
  const [scoreA, setScoreA] = useState(2)
  const [scoreB, setScoreB] = useState(1)

  const events = useMemo(
    () => [
      `23' Goal for Team A`,
      `45' Yellow card - Team B`,
      `58' Substitution - Team A`,
      `67' Goal for Team B`,
    ],
    [],
  )

  return (
    <WorkspacePageShell
      eyebrow="Live Operations"
      title="Scorer Console"
      description="Capture live match events with accurate timelines and scoreboard updates."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Live Match</h2>
          <div className="mt-5 text-center">
            <div className="mb-6 grid grid-cols-3 items-center">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Team A</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{scoreA}</p>
              </div>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">Live</span>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Team B</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{scoreB}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => setScoreA((prev) => prev + 1)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Goal Team A
              </button>
              <button onClick={() => setScoreB((prev) => prev + 1)} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
                Goal Team B
              </button>
            </div>
          </div>
        </article>
        <DataList title="Match Event Stream" items={events} />
      </div>
    </WorkspacePageShell>
  )
}

export default ScorerConsole