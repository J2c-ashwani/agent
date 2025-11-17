// Mock university data - in production, this would come from MongoDB
const universities = [
  {
    id: 1,
    name: "Sorbonne University",
    country: "France",
    programs: ["Engineering", "Business", "Liberal Arts"],
    intakeDates: ["September", "February"],
    description: "Located in Paris, one of the leading research universities in Europe.",
    studentCapacity: 500,
    applicationDeadline: "2025-06-30",
  },
  {
    id: 2,
    name: "Technical University of Munich",
    country: "Germany",
    programs: ["Engineering", "Computer Science", "Physics"],
    intakeDates: ["October", "April"],
    description: "Germany's leading technical university with strong industry connections.",
    studentCapacity: 600,
    applicationDeadline: "2025-07-31",
  },
  {
    id: 3,
    name: "University College Dublin",
    country: "Ireland",
    programs: ["Engineering", "Business", "Medicine", "Arts"],
    intakeDates: ["September"],
    description: "Ireland's leading research university in Dublin city center.",
    studentCapacity: 700,
    applicationDeadline: "2025-06-15",
  },
  {
    id: 4,
    name: "University of Barcelona",
    country: "Spain",
    programs: ["Engineering", "Business", "Medicine"],
    intakeDates: ["September", "February"],
    description: "Catalonia's largest university with international recognition.",
    studentCapacity: 800,
    applicationDeadline: "2025-07-15",
  },
  {
    id: 5,
    name: "University of Amsterdam",
    country: "Netherlands",
    programs: ["Engineering", "Business", "Law"],
    intakeDates: ["September"],
    description: "Ranked among Europe's top universities with strong academic programs.",
    studentCapacity: 400,
    applicationDeadline: "2025-06-30",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get("country")
  const search = searchParams.get("search")?.toLowerCase()

  let filtered = universities

  if (country) {
    filtered = filtered.filter((u) => u.country === country)
  }

  if (search) {
    filtered = filtered.filter(
      (u) => u.name.toLowerCase().includes(search) || u.description.toLowerCase().includes(search),
    )
  }

  return Response.json(filtered)
}
