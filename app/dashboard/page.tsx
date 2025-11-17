"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const agentData = [
  { month: "Jan", uploaded: 32 },
  { month: "Feb", uploaded: 41 },
  { month: "Mar", uploaded: 35 },
  { month: "Apr", uploaded: 48 },
  { month: "May", uploaded: 42 },
  { month: "Jun", uploaded: 54 },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session?.user?.name || "Agent"}!</p>
        <p className="text-sm text-gray-500 mt-1">Email: {session?.user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">252</div>
            <p className="text-xs text-gray-500 mt-1">Your total submissions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">18</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting admin review</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">142</div>
            <p className="text-xs text-gray-500 mt-1">56.3% acceptance rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Monthly Submissions</CardTitle>
          <CardDescription>Your application uploads over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uploaded" fill="#3b82f6" name="My Submissions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your student applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/dashboard/upload-students" className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition cursor-pointer">
              <div className="text-3xl mb-2">📤</div>
              <h3 className="font-semibold mb-1">Upload Students</h3>
              <p className="text-sm text-gray-600">Submit new student applications</p>
            </a>
            <a href="/dashboard/applications" className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition cursor-pointer">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold mb-1">My Applications</h3>
              <p className="text-sm text-gray-600">View only your submissions (252)</p>
            </a>
            <a href="/dashboard/universities" className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition cursor-pointer">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-semibold mb-1">Browse Universities</h3>
              <p className="text-sm text-gray-600">Explore 217+ partner institutions</p>
            </a>
            <a href="/dashboard/profile" className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition cursor-pointer">
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-semibold mb-1">Profile Settings</h3>
              <p className="text-sm text-gray-600">Update your information</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
