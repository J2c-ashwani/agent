import { StudentUploadForm } from "@/components/upload/student-upload-form"

export default function UploadStudentsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Student Applications</h1>
        <p className="text-gray-600">Submit new student applications with supporting documents</p>
      </div>
      <StudentUploadForm />
    </div>
  )
}
