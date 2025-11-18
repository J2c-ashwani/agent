import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, template, data } = await request.json()

    if (!process.env.RESEND_API_KEY) {
      console.log('[Email] Resend API key not configured, skipping email')
      return NextResponse.json({ 
        success: true, 
        message: 'Email skipped (API key not configured)',
        data: { to, subject, template }
      })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    let htmlContent = ''

    if (template === 'agent_status_changed') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Account Status Update</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hello <strong>${data.name}</strong>,</p>
            <p style="margin: 20px 0; font-size: 16px;">${data.message}</p>
            <p><strong>New Status:</strong> <span style="color: ${data.status === 'active' ? '#10b981' : '#ef4444'}; font-weight: bold; text-transform: uppercase;">${data.status}</span></p>
          </div>
          <p style="color: #6b7280;">If you have any questions, please contact our support team.</p>
        </div>
      `
    } else if (template === 'student_uploaded') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Student Application Uploaded</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Application ID:</strong> ${data.applicationId}</p>
            <p><strong>Agent:</strong> ${data.agentEmail}</p>
            <p><strong>Student Name:</strong> ${data.studentName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Preferred Country:</strong> ${data.country}</p>
            <p><strong>Course Interest:</strong> ${data.course}</p>
            <p><strong>Document:</strong> ${data.fileName}</p>
          </div>
          <p style="color: #6b7280;">Please review this application in the admin portal.</p>
        </div>
      `
    } else if (template === 'status_updated') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Application Status Updated</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Application ID:</strong> ${data.applicationId}</p>
            <p><strong>Student Name:</strong> ${data.studentName}</p>
            <p><strong>New Status:</strong> <span style="color: #10b981; font-weight: bold;">${data.status}</span></p>
            ${data.adminNotes ? `<p><strong>Admin Notes:</strong> ${data.adminNotes}</p>` : ''}
          </div>
          <p style="color: #6b7280;">Login to your agent portal to view full details.</p>
        </div>
      `
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'Join2Campus <noreply@join2campus.com>',
      to,
      subject,
      html: htmlContent,
    })

    if (error) {
      console.error('[Email] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: emailData })
  } catch (error: any) {
    console.error('[Email] Error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
