import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-2 p-4">
          <Link className="hover:bg-gray-700 p-2 rounded" to="/">
            Home
          </Link>
          <Link className="hover:bg-gray-700 p-2 rounded" to="/invoice">
            Invoice
          </Link>
          <Link className="hover:bg-gray-700 p-2 rounded" to="/reports">
            Reports
          </Link>
          <Link className="hover:bg-gray-700 p-2 rounded" to="/admin">
            Admin
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-auto m-4 bg-red-500 hover:bg-red-600 p-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow p-4 flex justify-between">
          <h1 className="font-semibold">My App</h1>
          <span className="text-gray-500">User</span>
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}