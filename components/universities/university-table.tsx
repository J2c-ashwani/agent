"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const countries = [
  "France",
  "Germany",
  "Ireland",
  "Spain",
  "Netherlands",
  "Italy",
  "Poland",
  "Portugal",
  "Czech Republic",
  "Austria",
  "Belgium",
  "Hungary",
  "Denmark",
  "Sweden",
  "Cyprus",
  "Malta",
]

interface University {
  id: number
  name: string
  country: string
  programs: string[]
  intakeDates: string[]
  description: string
  studentCapacity: number
  applicationDeadline: string
}

export function UniversityTable() {
  const [universities, setUniversities] = useState<University[]>([])
  const [search, setSearch] = useState("")
  const [country, setCountry] = useState<string>("all")
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUniversities()
  }, [search, country])

  const fetchUniversities = async () => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (country !== "all") params.append("country", country)

    try {
      const response = await fetch(`/api/universities?${params}`)
      const data = await response.json()
      setUniversities(data)
    } catch (error) {
      console.error("Failed to fetch universities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = () => {
    const csv = [
      ["University", "Country", "Programs", "Intake Dates"],
      ...universities.map((u) => [u.name, u.country, u.programs.join("; "), u.intakeDates.join(", ")]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "universities.csv"
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Search universities..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleExportPDF} variant="outline" className="gap-2 bg-transparent">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">University</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Country</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Programs</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Intake</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No universities found
                  </td>
                </tr>
              ) : (
                universities.map((uni) => (
                  <tr key={uni.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{uni.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{uni.country}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{uni.programs.slice(0, 2).join(", ")}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{uni.intakeDates.join(", ")}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUniversity(uni)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedUniversity} onOpenChange={(open) => !open && setSelectedUniversity(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedUniversity && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedUniversity.name}</DialogTitle>
                <DialogDescription>{selectedUniversity.country}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedUniversity.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Programs</h3>
                    <ul className="space-y-1">
                      {selectedUniversity.programs.map((prog, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {prog}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Intake Dates</h3>
                    <ul className="space-y-1">
                      {selectedUniversity.intakeDates.map((date, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {date}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1 text-sm">Student Capacity</h3>
                    <p className="text-sm text-gray-600">{selectedUniversity.studentCapacity} students</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm">Application Deadline</h3>
                    <p className="text-sm text-gray-600">{selectedUniversity.applicationDeadline}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
