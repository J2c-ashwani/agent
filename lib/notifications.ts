/**
 * Notification Service
 * Handles sending emails for student uploads and status updates
 */

import type { StudentUploadEmailData, StatusUpdateEmailData } from "./email-templates"

export interface NotificationPayload {
  to: string
  subject: string
  template: "student_uploaded" | "status_updated"
  data: StudentUploadEmailData | StatusUpdateEmailData
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  try {
    const response = await fetch("/api/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`)
    }

    console.log(`[Notifications] Email sent to ${payload.to}`)
  } catch (error) {
    console.error("[Notifications] Error:", error)
    // Log error but don't throw - notifications should not block uploads
  }
}

/**
 * Send notification when student is uploaded
 */
export async function notifyAdminStudentUploaded(adminEmail: string, data: StudentUploadEmailData): Promise<void> {
  await sendNotification({
    to: adminEmail,
    subject: `New Student Application: ${data.studentName}`,
    template: "student_uploaded",
    data,
  })
}

/**
 * Send notification when status is updated
 */
export async function notifyAgentStatusUpdated(agentEmail: string, data: StatusUpdateEmailData): Promise<void> {
  await sendNotification({
    to: agentEmail,
    subject: `Application Status Update: ${data.applicationId}`,
    template: "status_updated",
    data,
  })
}
