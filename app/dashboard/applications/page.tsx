import { ApplicationsTable } from "@/components/applications/applications-table"

export default function ApplicationsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applications Tracking</h1>
        <p className="text-gray-600">Monitor all student applications and their status updates</p>
      </div>
      <ApplicationsTable />
    </div>
  )
}
