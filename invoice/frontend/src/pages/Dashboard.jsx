export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Invoices</h3>
          <p className="text-2xl font-bold">24</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Reports</h3>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Users</h3>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>
    </div>
  );
}