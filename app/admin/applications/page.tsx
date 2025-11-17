"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface Application {
  id: string
  agentEmail: string
  studentName: string
  email: string
  country: string
  status: "pending" | "under_review" | "accepted" | "rejected"
  lastUpdated: string
  course: string
  adminNotes: string
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "yellow", label: "Pending" },
  under_review: { color: "blue", label: "Under Review" },
  accepted: { color: "green", label: "Accepted" },
  rejected: { color: "red", label: "Rejected" },
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/admin/applications")
        const data = await response.json()
        setApplications(data)
      } catch (error) {
        console.error("Failed to fetch applications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.agentEmail.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === "all" || app.status === status
    return matchesSearch && matchesStatus
  })

  const handleOpenApp = (app: Application) => {
    setSelectedApp(app)
    setNewStatus(app.status)
    setAdminNotes(app.adminNotes)
  }

  const handleSaveApp = async () => {
    if (!selectedApp) return

    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: newStatus,
          adminNotes,
        }),
      })

      if (response.ok) {
        setApplications((apps) =>
          apps.map((app) => (app.id === selectedApp.id ? { ...app, status: newStatus as any, adminNotes } : app)),
        )
        setSelectedApp(null)
      }
    } catch (error) {
      console.error("Failed to update application:", error)
    }
  }

  const getStatusBadge = (s: string) => {
    const config = statusConfig[s as keyof typeof statusConfig]
    const colorMap: Record<string, string> = {
      yellow: "bg-yellow-100 text-yellow-800",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
    }
    return <Badge className={colorMap[config.color]}>{config.label}</Badge>
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Applications</h1>
        <p className="text-gray-600">Review and manage student applications from all agents</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by student, email, or agent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Agent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Country</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Last Updated</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{app.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.agentEmail}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.country}</td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.lastUpdated}</td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenApp(app)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>Review Application</DialogTitle>
                <DialogDescription>{selectedApp.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold">Student Name</label>
                    <p className="text-lg mt-1">{selectedApp.studentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Email</label>
                    <p className="text-sm mt-1 break-all">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Course</label>
                    <p className="text-sm mt-1">{selectedApp.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Agent Email</label>
                    <p className="text-sm mt-1">{selectedApp.agentEmail}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for the agent..."
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setSelectedApp(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveApp}>Save Changes</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
