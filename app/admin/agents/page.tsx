"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Agent {
  id: string
  email: string
  name: string
  country: string
  applicationsCount: number
  joinedDate: string
  status: "active" | "inactive"
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/admin/agents")
        const data = await response.json()
        setAgents(data)
      } catch (error) {
        console.error("Failed to fetch agents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const filtered = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Agents</h1>
        <p className="text-gray-600">View and manage all partner agents</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button>Add Agent</Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500">No agents found</div>
        ) : (
          filtered.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{agent.name}</h3>
                      <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{agent.email}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Country</p>
                        <p className="font-semibold">{agent.country}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Applications</p>
                        <p className="font-semibold">{agent.applicationsCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Joined</p>
                        <p className="font-semibold">{new Date(agent.joinedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
