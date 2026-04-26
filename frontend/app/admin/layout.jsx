"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter();

  useEffect(() => {
    // Protect all /admin routes except /admin/login
    if (pathname !== '/admin/login') {
      const token = localStorage.getItem('admintoken') || sessionStorage.getItem('admintoken');
      if (!token) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admintoken');
    sessionStorage.removeItem('admintoken');
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Sellers', icon: Store, path: '/admin/sellers' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ]

  // If on /admin/login, render only the login page (no sidebar, no layout)
  if (pathname === '/admin/login') {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-30
          ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E5E0D8]">
          {isSidebarOpen ? (
            <h1 className="text-xl font-serif text-[#1A1A1A] tracking-wider font-bold">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-serif text-[#1A1A1A] tracking-wider font-bold">AP</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#FAF9F6] text-[#1A1A1A]"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37]' 
                        : 'text-[#5C5C5C] hover:bg-[#FAF9F6] hover:text-[#1A1A1A]'
                      }`}
                  >
                    <Icon size={20} />
                    {isSidebarOpen && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-[#E5E0D8]">
          <button
            className="flex items-center w-full p-3 text-[#5C5C5C] rounded-lg hover:bg-[#FAF9F6] hover:text-[#1A1A1A]"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {isSidebarOpen && (
              <span className="ml-3">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout 