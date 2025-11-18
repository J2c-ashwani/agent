"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, CheckCircle, Clock } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    accepted: 0,
    underReview: 0,
  })

  useEffect(() => {
    setMounted(true)
    // TODO: Fetch real stats from API
  }, [])

  if (!mounted) {
    return (
      <div className="p-8">
        <div className="h-32 bg-gray-100 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Under Review
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Accepted
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a 
            href="/dashboard/upload-students" 
            className="block p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">Upload Student Application</h3>
            <p className="text-sm text-gray-600">Submit new student documents</p>
          </a>
          <a 
            href="/dashboard/applications" 
            className="block p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">View My Applications</h3>
            <p className="text-sm text-gray-600">Track submission status</p>
          </a>
          <a 
            href="/dashboard/universities" 
            className="block p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">Browse Universities</h3>
            <p className="text-sm text-gray-600">217+ partner institutions</p>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
