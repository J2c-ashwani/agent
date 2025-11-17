"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Configure integrations and system settings</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Google Sheets Integration</CardTitle>
            <CardDescription>Connect to Google Sheets for syncing applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Set up Google Sheets API credentials in environment variables to enable syncing.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sheet ID</label>
              <Input
                placeholder="Google Sheet ID"
                disabled
                value={process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "Not configured"}
              />
            </div>
            <Button disabled>Configure</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure Resend for sending notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Add RESEND_API_KEY to environment variables to enable email notifications.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input
                placeholder="admin@join2campus.com"
                disabled
                value={process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Not configured"}
              />
            </div>
            <Button disabled>Configure</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Required</CardTitle>
            <CardDescription>Add these to your Vercel project settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono text-gray-600">
              <div>MONGODB_URI</div>
              <div>NEXTAUTH_SECRET</div>
              <div>NEXTAUTH_URL</div>
              <div>GOOGLE_SHEETS_CLIENT_EMAIL</div>
              <div>GOOGLE_SHEETS_PRIVATE_KEY</div>
              <div>GOOGLE_SHEET_ID</div>
              <div>RESEND_API_KEY</div>
              <div>ADMIN_EMAIL</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current integration status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Google Sheets</span>
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
