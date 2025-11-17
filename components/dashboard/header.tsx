"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild suppressHydrationWarning>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span suppressHydrationWarning>{session?.user?.email || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" suppressHydrationWarning>
            <DropdownMenuLabel suppressHydrationWarning>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem suppressHydrationWarning>
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: "/login" })}
              suppressHydrationWarning
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
