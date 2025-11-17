"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={session?.user?.email || ""} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={session?.user?.name || ""} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Input value={(session?.user as any)?.role || "agent"} disabled />
          </div>
          <Button disabled>Edit Profile (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  )
}
