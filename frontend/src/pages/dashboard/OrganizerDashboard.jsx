import { ActionPanel, DataList, WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'

const OrganizerDashboard = () => {
  return (
    <WorkspacePageShell
      eyebrow="Organizer Dashboard"
      title="Tournament Organizer Workspace"
      description="Create tournaments and manage only the tournaments you created."
    >
      <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Role check is enforced on route; this action is shown only on organizer/admin routes. */}
        <ActionPanel title="Create Tournament" description="Set up a new tournament with schedule and rules." actionLabel="Create Tournament" to="/dashboard/organizer/create-tournament" />
        <ActionPanel title="Manage My Tournaments" description="Update fixtures, registration, and tournament metadata." actionLabel="Manage Tournaments" to="/tournaments" />
        <ActionPanel title="View Match Feed" description="Monitor all matches tied to your tournaments." actionLabel="Open Matches" to="/matches" />
      </div>
      <div className="mt-6">
        <DataList
          title="Organizer Checklist"
          items={[
            'Create tournament and assign start/end dates',
            'Verify teams and participants before kickoff',
            'Publish updates for players and followers',
          ]}
        />
      </div>
    </WorkspacePageShell>
  )
}

export default OrganizerDashboard
