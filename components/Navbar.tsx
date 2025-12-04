'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, BookOpen, LogOut, User, GraduationCap, Book, Users, LayoutDashboard, Settings, ChevronDown, Shield, GraduationCap as StudentIcon, Users as InstructorIcon } from 'lucide-react';
import { getUser, logout } from '@/app/lib/auth';
import Image from 'next/image';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Profile dropdown বাইরে ক্লিক করলে বন্ধ করার জন্য
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.profile-dropdown-container')) {
        setProfileDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setMenuOpen(false);
    setProfileDropdown(false);
    router.push('/login');
  };

  const navLinks = [
    { name: 'Courses', href: '/courses', icon: GraduationCap },
    { name: 'About', href: '/about', icon: Users },
    { name: 'Blogs', href: '/blogs', icon: Book },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user || !user.role) return null;
    
    switch(user.role.toLowerCase()) {
      case 'admin':
        return { href: '/admin', label: 'Admin Dashboard', icon: Shield };
      case 'instructor':
        return { href: '/instructor', label: 'Instructor Dashboard', icon: InstructorIcon };
      case 'student':
        return { href: '/student', label: 'Student Dashboard', icon: StudentIcon };
      default:
        return { href: '/', label: 'Dashboard', icon: LayoutDashboard };
    }
  };

  // Check if user has any dashboard access
  const hasDashboardAccess = () => {
    if (!user) return false;
    
    const allowedRoles = ['admin', 'instructor', 'student'];
    return user.role && allowedRoles.includes(user.role.toLowerCase());
  };

  // Get role-based color
  const getRoleColor = (role: string) => {
    switch(role.toLowerCase()) {
      case 'admin':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'instructor':
        return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
      case 'student':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const roleColors = user ? getRoleColor(user.role) : null;
  const dashboardLink = getDashboardLink();

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-white/90 backdrop-blur-md py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                CourseMaster
              </span>
              <span className="text-xs text-gray-500 -mt-1">Learn & Grow</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-linear-to-r from-purple-50 to-purple-100 text-purple-700 shadow-sm border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${active ? 'font-semibold' : 'font-medium'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop User Menu with Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 group border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {user.photo ? (
                      <Image
                        src={user.photo}
                        alt={user.fullName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleColors?.bg}`}>
                        <User className={`w-5 h-5 ${roleColors?.text}`} />
                      </div>
                    )}
                    <div className="flex flex-col items-start">
                      <span className="text-gray-800 font-semibold text-sm">
                        {user.fullName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors?.bg} ${roleColors?.text}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${roleColors?.bg} ${roleColors?.text} font-medium`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500">{user.email || user.username}</span>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      {/* Dashboard Link - Role Based */}
                      {dashboardLink && hasDashboardAccess() && (
                        <Link
                          href={dashboardLink.href}
                          onClick={() => setProfileDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 border-l-2 ${roleColors?.border}`}
                        >
                          {dashboardLink.icon && <dashboardLink.icon className={`w-4 h-4 ${roleColors?.text}`} />}
                          <span>{dashboardLink.label}</span>
                        </Link>
                      )}
                      
                      <Link
                        href={`/${user.role?.toLowerCase()}/profile` || '/profile'}
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span>My Profile</span>
                      </Link>
                      
                      <Link
                        href={`/${user.role?.toLowerCase()}/settings` || '/settings'}
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-gray-700 hover:text-purple-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          menuOpen 
            ? 'max-h-96 opacity-100 mt-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-linear-to-r from-purple-50 to-purple-100 text-purple-700 border-l-4 border-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${active ? 'font-semibold' : ''}`}>
                    {link.name}
                  </span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
            
            {/* Dashboard Link in Mobile Menu - Role Based */}
            {dashboardLink && hasDashboardAccess() && (
              <Link
                href={dashboardLink.href}
                className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-300 border-l-2 ${roleColors?.border}`}
                onClick={() => setMenuOpen(false)}
              >
                {dashboardLink.icon && <dashboardLink.icon className={`w-5 h-5 ${roleColors?.text}`} />}
                <span className="font-medium">{dashboardLink.label}</span>
              </Link>
            )}
            
            <div className="h-px bg-gray-100 my-2"></div>
            
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  {user.photo ? (
                    <Image
                      src={user.photo}
                      alt={user.fullName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${roleColors?.bg}`}>
                      <User className={`w-6 h-6 ${roleColors?.text}`} />
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <span className="text-gray-800 font-semibold">{user.fullName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 self-start ${roleColors?.bg} ${roleColors?.text}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                
                <Link
                  href={`/${user.role?.toLowerCase()}/profile` || '/profile'}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span>My Profile</span>
                </Link>
                
                <Link
                  href={`/${user.role?.toLowerCase()}/settings` || '/settings'}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white text-center rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-md transition-all duration-300 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}