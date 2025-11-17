// Mock applications data
const mockApplications = [
  {
    id: "APP-1730100000-ABC123XYZ",
    studentName: "Alice Johnson",
    email: "alice@example.com",
    country: "Germany",
    status: "pending",
    lastUpdated: "2025-01-10",
    course: "Engineering",
    university: "Technical University of Munich",
  },
  {
    id: "APP-1730200000-DEF456UVW",
    studentName: "Bob Smith",
    email: "bob@example.com",
    country: "France",
    status: "under_review",
    lastUpdated: "2025-01-09",
    course: "Business",
    university: "Sorbonne University",
  },
  {
    id: "APP-1730300000-GHI789RST",
    studentName: "Carol White",
    email: "carol@example.com",
    country: "Ireland",
    status: "accepted",
    lastUpdated: "2025-01-08",
    course: "Medicine",
    university: "University College Dublin",
  },
  {
    id: "APP-1730400000-JKL012OPQ",
    studentName: "David Brown",
    email: "david@example.com",
    country: "Spain",
    status: "rejected",
    lastUpdated: "2025-01-07",
    course: "Law",
    university: "University of Barcelona",
  },
  {
    id: "APP-1730500000-MNO345LMN",
    studentName: "Emma Davis",
    email: "emma@example.com",
    country: "Netherlands",
    status: "pending",
    lastUpdated: "2025-01-06",
    course: "Computer Science",
    university: "University of Amsterdam",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")?.toLowerCase()

  let filtered = mockApplications

  if (status) {
    filtered = filtered.filter((app) => app.status === status)
  }

  if (search) {
    filtered = filtered.filter(
      (app) =>
        app.studentName.toLowerCase().includes(search) ||
        app.email.toLowerCase().includes(search) ||
        app.id.toLowerCase().includes(search),
    )
  }

  return Response.json(filtered)
}
