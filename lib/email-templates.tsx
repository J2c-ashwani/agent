/**
 * Email Templates using React Email
 * Templates for student upload notifications and status updates
 */

export interface StudentUploadEmailData {
  studentName: string
  email: string
  phone: string
  course: string
  country: string
  applicationId: string
  agentName: string
  documentLink: string
}

export interface StatusUpdateEmailData {
  studentName: string
  email: string
  status: "pending" | "under_review" | "accepted" | "rejected"
  applicationId: string
  adminNotes: string
  university?: string
}

/**
 * HTML template for new student upload notification
 */
export function getStudentUploadTemplate(data: StudentUploadEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 20px; border-radius: 8px; }
          .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail { margin: 12px 0; padding: 8px; background: white; border-left: 4px solid #1e40af; }
          .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; }
          .footer { font-size: 12px; color: #6b7280; margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Student Application Submitted</h1>
            <p>Application ID: ${data.applicationId}</p>
          </div>
          <div class="content">
            <h2>Student Details</h2>
            <div class="detail"><strong>Student Name:</strong> ${data.studentName}</div>
            <div class="detail"><strong>Email:</strong> ${data.email}</div>
            <div class="detail"><strong>Phone:</strong> ${data.phone}</div>
            <div class="detail"><strong>Course Interest:</strong> ${data.course}</div>
            <div class="detail"><strong>Preferred Country:</strong> ${data.country}</div>
            <div class="detail"><strong>Submitted By:</strong> ${data.agentName}</div>
            <p style="margin-top: 20px;">
              <a href="${data.documentLink}" class="button">View Supporting Document</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Join2Campus. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * HTML template for application status update
 */
export function getStatusUpdateTemplate(data: StatusUpdateEmailData): string {
  const statusColors: Record<string, string> = {
    pending: "#f59e0b",
    under_review: "#3b82f6",
    accepted: "#10b981",
    rejected: "#ef4444",
  }

  const statusText: Record<string, string> = {
    pending: "Pending",
    under_review: "Under Review",
    accepted: "Accepted",
    rejected: "Rejected",
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 20px; border-radius: 8px; }
          .status-badge { display: inline-block; background: ${statusColors[data.status]}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
          .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail { margin: 12px 0; padding: 8px; background: white; border-left: 4px solid #1e40af; }
          .footer { font-size: 12px; color: #6b7280; margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
            <p>Application ID: ${data.applicationId}</p>
          </div>
          <div class="content">
            <p>Hi ${data.studentName},</p>
            <p>We have an update on your application status:</p>
            <p style="text-align: center; margin: 20px 0;">
              <span class="status-badge">${statusText[data.status]}</span>
            </p>
            <div class="detail"><strong>Student Name:</strong> ${data.studentName}</div>
            <div class="detail"><strong>Email:</strong> ${data.email}</div>
            ${data.university ? `<div class="detail"><strong>University:</strong> ${data.university}</div>` : ""}
            ${data.adminNotes ? `<div class="detail"><strong>Notes:</strong> ${data.adminNotes}</div>` : ""}
            <p style="margin-top: 20px; color: #6b7280;">
              If you have any questions, please contact our support team.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Join2Campus. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
