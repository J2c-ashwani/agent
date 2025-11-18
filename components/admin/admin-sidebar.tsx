"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, Settings, Building2, GraduationCap, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/agents", label: "Manage Agents", icon: Users },
  { href: "/admin/applications", label: "All Applications", icon: FileText },
  { href: "/admin/universities", label: "Partner Universities", icon: Building2 },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 bg-red-900 text-white h-screen">
      <div className="p-6 border-b border-red-800">
        <h1 className="text-xl font-bold">Join2Campus</h1>
        <p className="text-sm text-red-200">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive ? "bg-red-700 text-white" : "text-red-100 hover:bg-red-800",
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-red-800 space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-100 hover:bg-red-800 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <p className="text-xs text-red-200 text-center">© 2025 Join2Campus Admin</p>
      </div>
    </div>
  )
}
