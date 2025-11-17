// Mock all applications data
const mockAllApplications = [
  {
    id: "APP-1730100000-ABC123XYZ",
    agentEmail: "agent@example.com",
    studentName: "Alice Johnson",
    email: "alice@example.com",
    country: "Germany",
    status: "pending",
    lastUpdated: "2025-01-10",
    course: "Engineering",
    adminNotes: "",
  },
  {
    id: "APP-1730200000-DEF456UVW",
    agentEmail: "maria.santos@join2campus.com",
    studentName: "Bob Smith",
    email: "bob@example.com",
    country: "France",
    status: "under_review",
    lastUpdated: "2025-01-09",
    course: "Business",
    adminNotes: "Waiting for additional documents",
  },
  {
    id: "APP-1730300000-GHI789RST",
    agentEmail: "david.kumar@join2campus.com",
    studentName: "Carol White",
    email: "carol@example.com",
    country: "Ireland",
    status: "accepted",
    lastUpdated: "2025-01-08",
    course: "Medicine",
    adminNotes: "Approved - waiting for enrollment confirmation",
  },
]

export async function GET() {
  return Response.json(mockAllApplications)
}

export async function PATCH(request: Request) {
  const { applicationId, status, adminNotes } = await request.json()

  // In production, this would update the database and sync with Google Sheets
  return Response.json({
    success: true,
    message: "Application updated",
    data: { applicationId, status, adminNotes },
  })
}
