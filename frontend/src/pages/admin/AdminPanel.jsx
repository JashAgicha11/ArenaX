import { ActionPanel, DataList, StatCard, WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'

const AdminPanel = () => {
  return (
    <WorkspacePageShell
      eyebrow="Administration"
      title="Admin Control Center"
      description="Manage users, tournaments, moderation pipelines, and operational health from one place."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Active Users" value="10,482" helper="+3.4% this week" />
        <StatCard label="Open Tournaments" value="184" helper="17 pending approval" />
        <StatCard label="System Health" value="99.97%" helper="Last 30 days uptime" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActionPanel title="User Management" description="Review accounts, role requests, and moderation flags." actionLabel="Manage Users" />
        <ActionPanel title="Tournament Governance" description="Audit brackets, score disputes, and compliance rules." actionLabel="Manage Tournaments" />
        <ActionPanel title="Platform Settings" description="Configure feature flags, integrations, and environment controls." actionLabel="Open Settings" />
      </div>
      <div className="mt-6">
        <DataList
          title="Operational Alerts"
          items={[
            '3 scorer-role escalation requests pending review',
            'Leaderboard sync delay detected in football category',
            'Upcoming maintenance window: Sunday 01:00 UTC',
          ]}
        />
      </div>
    </WorkspacePageShell>
  )
}

export default AdminPanel