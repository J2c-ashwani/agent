import { UniversityTable } from "@/components/universities/university-table"

export default function UniversitiesPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Partner Universities</h1>
        <p className="text-gray-600">Explore 217+ universities across Europe</p>
      </div>
      <UniversityTable />
    </div>
  )
}
