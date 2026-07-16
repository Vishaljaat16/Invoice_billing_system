import { Link } from "react-router-dom";

import { LayoutDashboard } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">Billing System</h1>

      {user?.role === "admin" && (
        <>
          <Link
            to="/dashboard/admin"
            className="flex gap-2 mb-4 hover:text-blue-400"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/dashboard/admin/categories"
            className="block mb-4 hover:text-blue-400"
          >
            Categories
          </Link>

          <Link
            to="/dashboard/admin/items"
            className="block mb-4 hover:text-blue-400"
          >
            Items
          </Link>
        </>
      )}

      {user?.role === "staff" && (
        <>
          <Link
            to="/dashboard/staff"
            className="block mb-4 hover:text-blue-400"
          >
            Dashboard
          </Link>

          <Link
            to="/dashboard/staff/invoice"
            className="block mb-4 hover:text-blue-400"
          >
            Invoice
          </Link>
        </>
      )}

      {user?.role === "accountant" && (
        <>
          <Link
            to="/dashboard/accountant"
            className="block mb-4 hover:text-blue-400"
          >
            Dashboard
          </Link>

          <Link
            to="/dashboard/accountant/reports"
            className="block mb-4 hover:text-blue-400"
          >
            Reports
          </Link>

          <Link to="/dashboard/staff/invoice" className="block py-2">
            Generate Invoice
          </Link>

          <Link to="/dashboard/staff/history" className="block py-2">
            Invoice History
          </Link>
        </>
      )}
    </div>
  );
}
