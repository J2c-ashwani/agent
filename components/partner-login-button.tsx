"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

interface PartnerLoginButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
}

/**
 * Partner Login Button Component
 * Export this component and add to Join2Campus header
 * Usage: <PartnerLoginButton />
 */
export function PartnerLoginButton({ className = "", variant = "outline" }: PartnerLoginButtonProps) {
  return (
    <Link href="/login">
      <Button variant={variant} className={`gap-2 ${className}`}>
        <LogIn size={16} />
        <span>Partner Login</span>
      </Button>
    </Link>
  )
}
