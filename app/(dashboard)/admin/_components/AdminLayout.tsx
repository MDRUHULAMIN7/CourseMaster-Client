// app/admin/_components/AdminLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart,
  LogOut,
  Menu,
  X,
  Shield,
  CheckCircle,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminTokenPayload {
  userId: string;
  email: string;
  role: string;
  verified: boolean;
  exp: number;
  type: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        // Skip check for verify page
        if (pathname === "/admin/verify") {
          setLoading(false);
          return;
        }

        const adminToken = localStorage.getItem("admin_token");
        
        if (!adminToken) {
          console.log("No admin token found, redirecting to verify");
          router.push("/admin/verify");
          return;
        }

        try {
          const decoded: AdminTokenPayload = jwtDecode(adminToken);
          const currentTime = Date.now() / 1000;
          
          // Check if token is valid and not expired
          if (decoded.exp > currentTime && decoded.verified) {
            setLoading(false);
          } else {
            console.log("Admin token expired or invalid");
            localStorage.removeItem("admin_token");
            router.push("/admin/verify");
          }
        } catch (tokenError) {
          console.log("Invalid admin token format");
          localStorage.removeItem("admin_token");
          router.push("/admin/verify");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/admin/verify");
      }
    };

    checkAdminAccess();
  }, [pathname, router]);

  // Detect if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: CheckCircle },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // Show loading state
  if (loading && pathname !== "/admin/verify") {
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Only show if not on verify page */}
      {pathname !== "/admin/verify" && (
        <div
          className={`${
            isMobile 
              ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300'
              : 'fixed inset-y-0 left-0 z-40 lg:block'
          } w-64 bg-white shadow-lg ${
            isMobile 
              ? sidebarOpen ? "translate-x-0" : "-translate-x-full"
              : sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Admin Panel
                </span>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1 ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Sidebar footer */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex flex-1 flex-col w-full transition-all duration-300 ${
        pathname !== "/admin/verify" && sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        {/* Header - Only show if not on verify page */}
        {pathname !== "/admin/verify" && (
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-3 rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              {/* এই লাইনটি সরিয়ে দিন বা কমেন্ট করুন */}
              {/* <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-3 hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:block"
              >
                <Menu className="h-6 w-6" />
              </button> */}
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main content area */}
        <main className={`flex-1 ${pathname !== "/admin/verify" ? 'overflow-y-auto p-4 lg:p-6 bg-gray-50' : ''}`}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}