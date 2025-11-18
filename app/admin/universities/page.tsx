"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, Edit, Trash2 } from "lucide-react"

interface University {
  id: string
  name: string
  country: string
  programs: string[]
  intakes: string[]
  tuition: string
  requirements: string
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    programs: '',
    intakes: '',
    tuition: '',
    requirements: '',
  })

  useEffect(() => {
    setMounted(true)
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      const res = await fetch('/api/admin/universities')
      const data = await res.json()
      if (data.success) {
        setUniversities(data.universities)
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/admin/universities/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          programs: formData.programs.split(',').map(p => p.trim()),
          intakes: formData.intakes.split(',').map(i => i.trim()),
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert('University added successfully!')
        setDialogOpen(false)
        setFormData({ name: '', country: '', programs: '', intakes: '', tuition: '', requirements: '' })
        fetchUniversities()
      } else {
        alert(data.error || 'Failed to add university')
      }
    } catch (error) {
      alert('Error adding university')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/universities/bulk-upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        alert(`Successfully uploaded ${data.count} universities!`)
        fetchUniversities()
      } else {
        alert(data.error || 'Failed to upload file')
      }
    } catch (error) {
      alert('Error uploading file')
    }
  }

  if (!mounted) {
    return (
      <div className="p-8">
        <div className="h-32 bg-gray-100 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partner Universities</h1>
          <p className="text-gray-600">Manage university listings and program details</p>
        </div>
        
        <div className="flex gap-2">
          <label htmlFor="bulk-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload CSV
              </span>
            </Button>
          </label>
          <input
            id="bulk-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild suppressHydrationWarning>
              <Button suppressHydrationWarning>
                <Plus className="mr-2 h-4 w-4" />
                Add University
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" suppressHydrationWarning>
              <DialogHeader suppressHydrationWarning>
                <DialogTitle suppressHydrationWarning>Add New University</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">University Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="programs">Programs (comma separated) *</Label>
                  <Input
                    id="programs"
                    value={formData.programs}
                    onChange={(e) => setFormData({ ...formData, programs: e.target.value })}
                    placeholder="Engineering, Business, Medicine"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="intakes">Intake Months (comma separated) *</Label>
                    <Input
                      id="intakes"
                      value={formData.intakes}
                      onChange={(e) => setFormData({ ...formData, intakes: e.target.value })}
                      placeholder="September, January"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tuition">Tuition Fees *</Label>
                    <Input
                      id="tuition"
                      value={formData.tuition}
                      onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                      placeholder="€12,000 - €25,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">Entry Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="IELTS 6.5, GPA 3.0, Bachelor's degree"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Add University</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Universities ({universities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading universities...</p>
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No universities yet. Add one or upload a CSV.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>University</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Programs</TableHead>
                    <TableHead>Intakes</TableHead>
                    <TableHead>Tuition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {universities.map((uni) => (
                    <TableRow key={uni.id}>
                      <TableCell className="font-medium">{uni.name}</TableCell>
                      <TableCell>{uni.country}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {uni.programs.slice(0, 2).map((p, i) => (
                            <Badge key={i} variant="outline">{p}</Badge>
                          ))}
                          {uni.programs.length > 2 && (
                            <Badge variant="outline">+{uni.programs.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{uni.intakes.join(', ')}</TableCell>
                      <TableCell>{uni.tuition}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
