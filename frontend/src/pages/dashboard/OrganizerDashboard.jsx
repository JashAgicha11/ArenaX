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
        <ActionPanel title="Create Team" description="Create teams under your tournament." actionLabel="Create Team" to="/dashboard/organizer/create-team" />
        <ActionPanel title="Add Player To Team" description="Attach players using unique playerId." actionLabel="Add Player" to="/dashboard/organizer/add-player" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActionPanel title="Create Match" description="Create match fixtures between teams." actionLabel="Create Match" to="/dashboard/organizer/create-match" />
        <ActionPanel title="Manage My Tournaments" description="Update fixtures, registration, and tournament metadata." actionLabel="Manage Tournaments" to="/tournaments" />
      </div>
      <div className="mt-6">
        <DataList
          title="Organizer Checklist"
          items={[
            'Create tournament and assign start/end dates',
            'Create teams and add players by playerId',
            'Create matches with valid team/player links',
          ]}
        />
      </div>
    </WorkspacePageShell>
  )
}

export default OrganizerDashboard
