"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Sellers', icon: Store, path: '/admin/sellers' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-30
          ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold text-rose-600">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold text-rose-600">AP</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
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
                        ? 'bg-rose-50 text-rose-600' 
                        : 'text-gray-600 hover:bg-gray-50'
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

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            className="flex items-center w-full p-3 text-gray-600 rounded-lg hover:bg-gray-50"
            onClick={() => {/* Handle logout */}}
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