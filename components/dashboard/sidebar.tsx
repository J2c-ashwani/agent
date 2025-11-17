"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Upload, FileText, User } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/universities", label: "Universities", icon: BookOpen },
  { href: "/dashboard/upload-students", label: "Upload Students", icon: Upload },
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Join2Campus</h1>
        <p className="text-sm text-slate-400">Partner Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800",
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400">© 2025 Join2Campus</p>
      </div>
    </div>
  )
}
