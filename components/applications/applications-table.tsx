"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ChevronDown } from "lucide-react"

interface Application {
  id: string
  studentName: string
  email: string
  country: string
  status: "pending" | "under_review" | "accepted" | "rejected"
  lastUpdated: string
  course: string
  university: string
}

const statusConfig = {
  pending: { color: "yellow", label: "Pending" },
  under_review: { color: "blue", label: "Under Review" },
  accepted: { color: "green", label: "Accepted" },
  rejected: { color: "red", label: "Rejected" },
}

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString())

  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (status !== "all") params.append("status", status)

    try {
      const response = await fetch(`/api/applications?${params}`)
      const data = await response.json()
      setApplications(data)
      setLastSyncTime(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchApplications()
    }, 60000)
    return () => clearInterval(interval)
  }, [fetchApplications])

  const getStatusBadge = (status: Application["status"]) => {
    const config = statusConfig[status]
    const colorMap: Record<string, string> = {
      yellow: "bg-yellow-100 text-yellow-800",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
    }
    return <Badge className={colorMap[config.color]}>{config.label}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by student name, email, or application ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-48">
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
        <Button
          onClick={fetchApplications}
          variant="outline"
          size="icon"
          disabled={isLoading}
          className="flex-shrink-0 bg-transparent"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="text-sm text-gray-500">Last synced: {lastSyncTime} • Auto-refresh every 60 seconds</div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Application ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Country</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-sm font-mono text-blue-600">{app.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.country}</td>
                    <td className="px-6 py-4 text-sm">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.lastUpdated}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)} className="gap-1">
                        <span>View</span>
                        <ChevronDown size={16} />
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
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>{selectedApp.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Student Name</h3>
                    <p className="text-lg font-semibold mt-1">{selectedApp.studentName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Email</h3>
                    <p className="text-lg font-semibold mt-1 break-all">{selectedApp.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Course</h3>
                    <p className="text-lg font-semibold mt-1">{selectedApp.course}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Preferred Country</h3>
                    <p className="text-lg font-semibold mt-1">{selectedApp.country}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">University</h3>
                    <p className="text-lg font-semibold mt-1">{selectedApp.university}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                    <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Last Updated</h3>
                  <p className="text-sm mt-1">{new Date(selectedApp.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
