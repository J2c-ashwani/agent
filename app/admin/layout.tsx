"use client"

import type React from "react"
import { Providers } from "@/components/providers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </Providers>
  )
}
