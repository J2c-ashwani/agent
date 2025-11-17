"use client"

import Link from "link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface AdminLoginButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
}

/**
 * Admin Login Button Component
 * For quick access to admin panel (usually restricted to internal use)
 */
export function AdminLoginButton({ className = "", variant = "ghost" }: AdminLoginButtonProps) {
  return (
    <Link href="/admin/login">
      <Button variant={variant} className={`gap-2 ${className}`}>
        <Shield size={16} />
        <span>Admin</span>
      </Button>
    </Link>
  )
}
