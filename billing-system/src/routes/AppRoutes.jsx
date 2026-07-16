import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/Dashboard";
import StaffDashboard from "../pages/staff/Dashboard";
import AccountantDashboard from "../pages/accountant/Dashboard";

import Categories from "../pages/admin/Categories";
import Items from "../pages/admin/Items";

import DashboardLayout from "../layouts/DashboardLayout";

import RoleGuard from "./RoleGuard";

const Unauthorized = () => (
  <div className="flex justify-center items-center h-screen text-3xl font-bold">
    Unauthorized Access
  </div>
);

const NotFound = () => (
  <div className="flex justify-center items-center h-screen text-3xl font-bold">
    404 Page Not Found
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin */}

        <Route
          path="/dashboard/admin"
          element={
            <RoleGuard role="admin">
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        {/* Staff */}

        <Route
          path="/dashboard/staff"
          element={
            <RoleGuard role="staff">
              <DashboardLayout>
                <StaffDashboard />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        {/* Accountant */}

        <Route
          path="/dashboard/accountant"
          element={
            <RoleGuard role="accountant">
              <DashboardLayout>
                <AccountantDashboard />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        <Route
          path="/dashboard/admin/categories"
          element={
            <RoleGuard role="admin">
              <DashboardLayout>
                <Categories />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        <Route
          path="/dashboard/admin/items"
          element={
            <RoleGuard role="admin">
              <DashboardLayout>
                <Items />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
