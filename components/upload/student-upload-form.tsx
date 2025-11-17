"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUploadZone } from "./file-upload-zone"
import { CheckCircle, AlertCircle } from "lucide-react"

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

const courses = [
  "Engineering",
  "Business",
  "Computer Science",
  "Medicine",
  "Law",
  "Liberal Arts",
  "Physics",
  "Chemistry",
  "Biology",
  "Other",
]

interface UploadResponse {
  success: boolean
  applicationId: string
  message: string
  data?: {
    studentName: string
    email: string
    phone: string
    courseInterest: string
    preferredCountry: string
    passportNumber: string
    fileName: string
    uploadedAt: string
  }
}

export function StudentUploadForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    passportNumber: "",
    courseInterest: "",
    preferredCountry: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successData, setSuccessData] = useState<UploadResponse | null>(null)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessData(null)

    // Validation
    if (!formData.studentName || !formData.email || !formData.phone || !formData.passportNumber) {
      setError("Please fill in all required fields")
      return
    }

    if (!formData.courseInterest || !formData.preferredCountry) {
      setError("Please select course interest and preferred country")
      return
    }

    if (!selectedFile) {
      setError("Please upload a document")
      return
    }

    setIsLoading(true)

    try {
      const form = new FormData()
      form.append("studentName", formData.studentName)
      form.append("email", formData.email)
      form.append("phone", formData.phone)
      form.append("passportNumber", formData.passportNumber)
      form.append("courseInterest", formData.courseInterest)
      form.append("preferredCountry", formData.preferredCountry)
      form.append("file", selectedFile)

      const response = await fetch("/api/students/upload", {
        method: "POST",
        body: form,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Upload failed")
      } else {
        setSuccessData(data)
        // Reset form
        setFormData({
          studentName: "",
          email: "",
          phone: "",
          passportNumber: "",
          courseInterest: "",
          preferredCountry: "",
        })
        setSelectedFile(null)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (successData) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle size={48} className="text-green-600 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
              <p className="text-gray-600 mt-2">Your student application has been successfully uploaded.</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-left space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Application ID:</span>{" "}
                <span className="font-mono text-blue-600">{successData.applicationId}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Student:</span> {successData.data?.studentName}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Email:</span> {successData.data?.email}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Country:</span> {successData.data?.preferredCountry}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Course:</span> {successData.data?.courseInterest}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Submitted:</span>{" "}
                {new Date(successData.data?.uploadedAt || "").toLocaleDateString()}
              </p>
            </div>

            <Button onClick={() => setSuccessData(null)} className="w-full">
              Submit Another Application
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Student Application</CardTitle>
        <CardDescription>Submit student details and supporting documents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle size={16} className="mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="studentName" className="text-sm font-medium">
                Student Name *
              </label>
              <Input
                id="studentName"
                name="studentName"
                placeholder="John Doe"
                value={formData.studentName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="passportNumber" className="text-sm font-medium">
                Passport Number *
              </label>
              <Input
                id="passportNumber"
                name="passportNumber"
                placeholder="AB123456"
                value={formData.passportNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="courseInterest" className="text-sm font-medium">
                Course Interest *
              </label>
              <Select
                value={formData.courseInterest}
                onValueChange={(value) => handleSelectChange("courseInterest", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="preferredCountry" className="text-sm font-medium">
                Preferred Country *
              </label>
              <Select
                value={formData.preferredCountry}
                onValueChange={(value) => handleSelectChange("preferredCountry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Supporting Document (PDF or Word) *</label>
            <FileUploadZone
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              onFileRemove={() => setSelectedFile(null)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
