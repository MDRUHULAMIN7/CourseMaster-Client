"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AdminTokenPayload {
  userId: string;
  email: string;
  role: string;
  verified: boolean;
  exp: number;
}

export default function VerifyAdminPage() {
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const adminToken = localStorage.getItem("admin_token");
        
        if (adminToken) {
          try {
            const decoded: AdminTokenPayload = jwtDecode(adminToken);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp > currentTime && decoded.verified) {
              console.log(" Admin token is valid, redirecting to dashboard");
              router.push("/admin");
              return;
            } else {
              console.log(" Admin token expired, removing...");
              localStorage.removeItem("admin_token");
            }
          } catch (tokenError) {
            console.log(" Invalid admin token, removing...");
            localStorage.removeItem("admin_token");
          }
        }

        //  check  authentication
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          router.push("/");
          return;
        }

        const user = JSON.parse(userString);
        if (user.role !== "admin") {
          router.push("/");
          return;
        }

        setUserData(user);
      } catch (err) {
        console.error("Error:", err);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      
      if (!token || !userString) {
        setError("Please login first");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id || user.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/verify-passkey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          passkey,
          userId,
        }),
      });

      const result = await response.json();
      console.log(" API Response:", result);

      if (result.success) {
        setSuccess(" Verification successful! Generating admin token...");
        
        const adminToken = result.token || generateAdminToken(user);
        
        if (adminToken) {
          localStorage.setItem("admin_token", adminToken);
          
          console.log(" Admin token saved:", adminToken.substring(0, 20) + "...");
          
          setSuccess(" Admin access granted! Redirecting...");
          
          setTimeout(() => {
            router.push("/admin");
          }, 1500);
        } else {
          setError(" Token generation failed");
        }
      } else {
        setError(` ${result.message || "Verification failed"}`);
      }
    } catch (err: any) {
      console.error(" Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const generateAdminToken = (user: any): string => {
    try {
      const tokenData = {
        userId: user._id || user.id,
        email: user.email,
        role: user.role,
        verified: true,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 1 * 60 * 60 * 1000, 
      };
      
      const tokenString = JSON.stringify(tokenData);
      const base64Token = btoa(encodeURIComponent(tokenString));
      const signature = btoa(`admin-${Date.now()}`);
      return `${base64Token}.${signature}`;
    } catch (err) {
      console.error("Token generation error:", err);
      return "";
    }
  };


  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Verification</h1>
          <p className="text-gray-600">Secure admin access requires passkey verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Passkey
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter admin passkey"
              required
              disabled={loading}
              autoComplete="off"
            />
         
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-green-700 font-medium">{success}</p>
                  <p className="text-green-600 text-sm mt-1">Creating secure admin session...</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passkey.trim()}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying & Generating Token...</span>
              </span>
            ) : (
              "Verify  Admin "
            )}
          </button>
        </form>

      </div>
    </div>
  );
}