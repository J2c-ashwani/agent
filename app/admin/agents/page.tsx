"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreVertical, UserPlus, Ban, CheckCircle, Trash2, Key, Eye, Edit, Download, Mail, Activity } from "lucide-react"

interface Agent {
  id: string
  email: string
  name: string
  company: string
  country: string
  phone: string
  status: string
  totalApplications: number
  acceptedApplications: number
  commission: number
  lastLogin?: string
  createdAt: string
}

interface AgentActivity {
  date: string
  action: string
  details: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([])
  const [newPassword, setNewPassword] = useState('')
  const [mounted, setMounted] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'suspend' | 'activate' | 'delete' | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    country: 'India',
    phone: '',
    password: '',
  })
  const [editFormData, setEditFormData] = useState({
    name: '',
    company: '',
    country: '',
    phone: '',
  })

  useEffect(() => {
    setMounted(true)
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/admin/agents/list')
      const data = await res.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgentDetails = async (agentId: string) => {
    try {
      const res = await fetch(`/api/admin/agents/details?agentId=${agentId}`)
      const data = await res.json()
      if (data.success) {
        setAgentActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Failed to fetch agent details:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/admin/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        alert('Agent created successfully!')
        setDialogOpen(false)
        setFormData({ email: '', name: '', company: '', country: 'India', phone: '', password: '' })
        fetchAgents()
      } else {
        alert(data.error || 'Failed to create agent')
      }
    } catch (error) {
      alert('Error creating agent')
    }
  }

  const handleEdit = async () => {
    if (!selectedAgent) return

    try {
      const res = await fetch('/api/admin/agents/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentId: selectedAgent.id, 
          ...editFormData 
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert('Agent updated successfully!')
        setEditDialogOpen(false)
        setSelectedAgent(null)
        fetchAgents()
      } else {
        alert(data.error || 'Failed to update agent')
      }
    } catch (error) {
      alert('Error updating agent')
    }
  }

  const handleStatusChange = async (agentId: string, newStatus: string, sendEmail: boolean = false) => {
    try {
      const res = await fetch('/api/admin/agents/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, status: newStatus, sendEmail }),
      })

      const data = await res.json()

      if (data.success) {
        alert(`Agent ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!${sendEmail ? ' Email sent.' : ''}`)
        fetchAgents()
      } else {
        alert(data.error || 'Failed to update status')
      }
    } catch (error) {
      alert('Error updating status')
    }
  }

  const handleDelete = async () => {
    if (!selectedAgent) return

    try {
      const res = await fetch('/api/admin/agents/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgent.id }),
      })

      const data = await res.json()

      if (data.success) {
        alert('Agent deleted successfully!')
        setDeleteDialogOpen(false)
        setSelectedAgent(null)
        fetchAgents()
      } else {
        alert(data.error || 'Failed to delete agent')
      }
    } catch (error) {
      alert('Error deleting agent')
    }
  }

  const handleResetPassword = async () => {
    if (!selectedAgent || !newPassword) return

    try {
      const res = await fetch('/api/admin/agents/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgent.id, newPassword }),
      })

      const data = await res.json()

      if (data.success) {
        alert('Password reset successfully!')
        setResetPasswordDialogOpen(false)
        setSelectedAgent(null)
        setNewPassword('')
      } else {
        alert(data.error || 'Failed to reset password')
      }
    } catch (error) {
      alert('Error resetting password')
    }
  }

  const handleBulkAction = async () => {
    if (selectedAgents.length === 0 || !bulkAction) return

    try {
      const res = await fetch('/api/admin/agents/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentIds: selectedAgents, action: bulkAction }),
      })

      const data = await res.json()

      if (data.success) {
        alert(`Bulk action completed! ${data.affected} agents affected.`)
        setBulkActionDialogOpen(false)
        setSelectedAgents([])
        setBulkAction(null)
        fetchAgents()
      } else {
        alert(data.error || 'Failed to perform bulk action')
      }
    } catch (error) {
      alert('Error performing bulk action')
    }
  }

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/admin/agents/export')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `agents-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Error exporting CSV')
    }
  }

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const toggleAllAgents = () => {
    if (selectedAgents.length === agents.length) {
      setSelectedAgents([])
    } else {
      setSelectedAgents(agents.map(a => a.id))
    }
  }

  if (!mounted) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-32 bg-gray-100 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Agents</h1>
          <p className="text-gray-600">Add and manage education consultant agents</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          
          {selectedAgents.length > 0 && (
            <Button variant="outline" onClick={() => setBulkActionDialogOpen(true)}>
              Bulk Actions ({selectedAgents.length})
            </Button>
          )}
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild suppressHydrationWarning>
              <Button suppressHydrationWarning>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" suppressHydrationWarning>
              <DialogHeader suppressHydrationWarning>
                <DialogTitle suppressHydrationWarning>Create New Agent</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Create Agent</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Agents ({agents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No agents yet. Click "Add New Agent" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedAgents.length === agents.length}
                        onCheckedChange={toggleAllAgents}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedAgents.includes(agent.id)}
                          onCheckedChange={() => toggleAgentSelection(agent.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>{agent.company || '-'}</TableCell>
                      <TableCell>
                        {agent.totalApplications} 
                        <span className="text-green-600 ml-1">({agent.acceptedApplications} accepted)</span>
                      </TableCell>
                      <TableCell>₹{agent.commission || 0}</TableCell>
                      <TableCell>
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {agent.lastLogin ? new Date(agent.lastLogin).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedAgent(agent)
                              setDetailsDialogOpen(true)
                              fetchAgentDetails(agent.id)
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedAgent(agent)
                              setEditFormData({
                                name: agent.name,
                                company: agent.company,
                                country: agent.country,
                                phone: agent.phone,
                              })
                              setEditDialogOpen(true)
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Info
                            </DropdownMenuItem>
                            {agent.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(agent.id, 'suspended', true)}>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend Agent
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(agent.id, 'active', true)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate Agent
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => {
                              setSelectedAgent(agent)
                              setResetPasswordDialogOpen(true)
                            }}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedAgent(agent)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Agent
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agent Details - {selectedAgent?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{selectedAgent?.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{selectedAgent?.phone || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Company</Label>
                  <p className="font-medium">{selectedAgent?.company || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Country</Label>
                  <p className="font-medium">{selectedAgent?.country}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Total Applications</Label>
                  <p className="font-medium text-2xl">{selectedAgent?.totalApplications}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Accepted Applications</Label>
                  <p className="font-medium text-2xl text-green-600">{selectedAgent?.acceptedApplications}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-2">
                {agentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No activity yet</p>
                ) : (
                  agentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded">
                      <Activity className="h-4 w-4 mt-1 text-gray-400" />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="commission">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Tracking</CardTitle>
                  <CardDescription>Performance-based earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Commission Earned:</span>
                      <span className="text-2xl font-bold text-green-600">₹{selectedAgent?.commission || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average per Application:</span>
                      <span className="font-medium">
                        ₹{selectedAgent?.totalApplications 
                          ? Math.round((selectedAgent.commission || 0) / selectedAgent.totalApplications)
                          : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent Info</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={editFormData.company}
                onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Action</DialogTitle>
            <DialogDescription>
              Perform action on {selectedAgents.length} selected agent(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={() => setBulkAction('activate')}
                className={bulkAction === 'activate' ? 'border-green-500' : ''}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate All
              </Button>
              <Button 
                variant="outline"
                onClick={() => setBulkAction('suspend')}
                className={bulkAction === 'suspend' ? 'border-yellow-500' : ''}
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspend All
              </Button>
              <Button 
                variant="outline"
                onClick={() => setBulkAction('delete')}
                className={bulkAction === 'delete' ? 'border-red-500' : ''}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setBulkActionDialogOpen(false)
              setBulkAction(null)
            }}>Cancel</Button>
            <Button onClick={handleBulkAction} disabled={!bulkAction}>
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent <strong>{selectedAgent?.name}</strong> and all their data. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAgent(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Reset password for <strong>{selectedAgent?.name}</strong>
            </p>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setResetPasswordDialogOpen(false)
              setSelectedAgent(null)
              setNewPassword('')
            }}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={!newPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
