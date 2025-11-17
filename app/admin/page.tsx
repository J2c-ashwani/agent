"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const statsData = [
  { month: "Jan", agents: 4, applications: 120, accepted: 45 },
  { month: "Feb", agents: 5, applications: 145, accepted: 58 },
  { month: "Mar", agents: 5, applications: 168, accepted: 62 },
  { month: "Apr", agents: 6, applications: 195, accepted: 78 },
  { month: "May", agents: 7, applications: 228, accepted: 92 },
  { month: "Jun", agents: 7, applications: 256, accepted: 115 },
]

export default function AdminDashboard() {
  const { data: session } = useSession()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">System-wide Overview - All Agents & Applications</p>
        <p className="text-sm text-gray-500 mt-1">Logged in as: {session?.user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">45</div>
            <p className="text-xs text-gray-500 mt-1">Active partners across network</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,112</div>
            <p className="text-xs text-gray-500 mt-1">+14% this month (all agents)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">87</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting your action</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">45%</div>
            <p className="text-xs text-gray-500 mt-1">Overall system success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Growth Metrics</CardTitle>
          <CardDescription>System-wide agents, applications, and acceptance trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#3b82f6" name="Total Applications" />
              <Bar dataKey="accepted" fill="#10b981" name="Accepted" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>System management and oversight</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/applications" className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-500 transition cursor-pointer">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold mb-1">All Applications</h3>
              <p className="text-sm text-gray-600">Review 1,112 applications from all agents</p>
            </a>
            <a href="/admin/agents" className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-500 transition cursor-pointer">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold mb-1">Manage Agents</h3>
              <p className="text-sm text-gray-600">View and manage 45 partner agents</p>
            </a>
            <a href="/admin/settings" className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-500 transition cursor-pointer">
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-semibold mb-1">System Settings</h3>
              <p className="text-sm text-gray-600">Configure global parameters</p>
            </a>
            <a href="/dashboard/universities" className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-500 transition cursor-pointer">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-semibold mb-1">Partner Universities</h3>
              <p className="text-sm text-gray-600">Manage 217+ university partnerships</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
