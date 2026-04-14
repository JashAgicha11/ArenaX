const AdminPanel = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">Manage users, roles, and permissions</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Manage Users
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tournament Management</h2>
          <p className="text-gray-600 mb-4">Create and manage tournaments</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Manage Tournaments
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-gray-600 mb-4">Configure system settings</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel