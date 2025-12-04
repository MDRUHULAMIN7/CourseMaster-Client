// client/app/admin/page.tsx - Admin Dashboard
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AdminTokenPayload {
  userId: string;
  email: string;
  role: string;
  verified: boolean;
  exp: number;
  type: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAdminAccess = () => {
      try {
        // 1. Check admin token first
        const adminToken = localStorage.getItem("admin_token");
        
        if (adminToken) {
          try {
            const decoded: AdminTokenPayload = jwtDecode(adminToken);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp > currentTime && decoded.verified && decoded.type === 'admin_access') {
              console.log("✅ Valid admin token found");
              setAdminData({
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                tokenExpiry: new Date(decoded.exp * 1000).toLocaleString()
              });
              setLoading(false);
              return;
            } else {
              console.log("❌ Admin token expired or invalid");
              localStorage.removeItem("admin_token");
            }
          } catch (tokenError) {
            console.log("❌ Invalid admin token format");
            localStorage.removeItem("admin_token");
          }
        }

        // 2. If no valid admin token, redirect to verify page
        console.log("⚠️ No valid admin token, redirecting to verify");
        router.push("/admin/verify");
        
      } catch (error) {
        console.error("Error verifying admin access:", error);
        router.push("/admin/verify");
      }
    };

    verifyAdminAccess();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token_expiry");
    localStorage.removeItem("admin_verified");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{adminData?.email}</p>
                <p className="text-xs text-gray-500">Token expires: {adminData?.tokenExpiry}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Admin Dashboard</h2>
            <p className="text-gray-600 mb-6">You have successfully verified admin access.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Token Status</h3>
                <p className="text-green-600 font-bold">✅ Active</p>
                <p className="text-sm text-gray-500 mt-1">Expires: {adminData?.tokenExpiry}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Admin Role</h3>
                <p className="text-red-600 font-bold uppercase">{adminData?.role}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Session Duration</h3>
                <p className="text-blue-600 font-bold">6 Hours</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-gray-800 mb-4">Available Actions</h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Manage Users
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  View Analytics
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}