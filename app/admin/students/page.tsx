"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Eye } from "lucide-react"

interface Student {
  id: string
  applicationId: string
  studentName: string
  email: string
  phone: string
  agentEmail: string
  agentName: string
  country: string
  course: string
  status: string
  createdAt: string
  documentUrl?: string
  adminNotes?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Student | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students/list')
      const data = await res.json()
      if (data.success) {
        setStudents((data.students || []).map((s: any) => ({
          id: s._id?.toString() || '',
          applicationId: s.applicationId || '',
          studentName: s.studentName || '',
          email: s.email || '',
          phone: s.phone || '',
          agentEmail: s.agentEmail || '',
          agentName: s.agentName || '',
          country: s.country || '',
          course: s.course || '',
          status: s.status || '',
          createdAt: s.createdAt ? new Date(s.createdAt).toLocaleString() : '',
          documentUrl: s.documentUrl || '',
          adminNotes: s.adminNotes || '',
        })))
      }
    } catch { /* handle error */ }
    setLoading(false)
  }

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
    || s.email.toLowerCase().includes(search.toLowerCase())
    || s.agentName.toLowerCase().includes(search.toLowerCase())
    || s.applicationId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <input
          className="border rounded px-3 py-2"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            All Students ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading
            ? <div>Loading...</div>
            : filtered.length === 0
              ? <div className="text-center text-gray-500 py-10">No students found.</div>
              : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(st => (
                        <TableRow key={st.id}>
                          <TableCell className="font-medium">{st.studentName}</TableCell>
                          <TableCell>{st.email}</TableCell>
                          <TableCell>{st.course}</TableCell>
                          <TableCell>
                            <Badge variant={st.status === "approved" ? "default" : "secondary"}>
                              {st.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{st.agentName}</TableCell>
                          <TableCell>{st.country}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setSelected(st); setDetailsOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
          }
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><b>Name:</b> {selected?.studentName}</div>
            <div><b>Email:</b> {selected?.email}</div>
            <div><b>Phone:</b> {selected?.phone}</div>
            <div><b>Application ID:</b> {selected?.applicationId}</div>
            <div><b>Course:</b> {selected?.course}</div>
            <div><b>Country:</b> {selected?.country}</div>
            <div><b>Agent:</b> {selected?.agentName} ({selected?.agentEmail})</div>
            <div><b>Status:</b> {selected?.status}</div>
            <div><b>Submitted:</b> {selected?.createdAt}</div>
            {selected?.documentUrl ? (
              <div>
                <b>Document:</b> <a href={selected.documentUrl} target="_blank" rel="noopener noreferrer">Download</a>
              </div>
            ) : null}
            <div>
              <b>Admin Notes:</b><br />
              <span>{selected?.adminNotes}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
