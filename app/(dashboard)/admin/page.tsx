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
              console.log("Valid admin token found");
              setAdminData({
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                tokenExpiry: new Date(decoded.exp * 1000).toLocaleString()
              });
              setLoading(false);
              return;
            } else {
              console.log("Admin token expired or invalid");
              localStorage.removeItem("admin_token");
            }
          } catch (tokenError) {
            console.log(" Invalid admin token format");
            localStorage.removeItem("admin_token");
          }
        }

        // 2. If no valid admin token, redirect to verify page
        console.log(" No valid admin token, redirecting to verify");
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
          <p className="mt-4 text-gray-600">Verifying admin access..</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
  <h1>hello</h1>
    </div>
  );
}