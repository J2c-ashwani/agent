// Mock agents data
const mockAgents = [
  {
    id: "1",
    email: "agent@example.com",
    name: "John Agent",
    country: "USA",
    applicationsCount: 45,
    joinedDate: "2024-06-15",
    status: "active",
  },
  {
    id: "2",
    email: "maria.santos@join2campus.com",
    name: "Maria Santos",
    country: "Brazil",
    applicationsCount: 38,
    joinedDate: "2024-07-20",
    status: "active",
  },
  {
    id: "3",
    email: "david.kumar@join2campus.com",
    name: "David Kumar",
    country: "India",
    applicationsCount: 52,
    joinedDate: "2024-05-10",
    status: "active",
  },
  {
    id: "4",
    email: "sophie.martin@join2campus.com",
    name: "Sophie Martin",
    country: "France",
    applicationsCount: 31,
    joinedDate: "2024-08-01",
    status: "inactive",
  },
]

export async function GET() {
  return Response.json(mockAgents)
}
