import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const studentName = formData.get('studentName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const passportNumber = formData.get('passportNumber') as string
    const courseInterest = formData.get('courseInterest') as string
    const preferredCountry = formData.get('preferredCountry') as string
    const file = formData.get('file') as File

    // Validation
    if (!studentName || !email || !phone || !passportNumber || !courseInterest || !preferredCountry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 2MB limit' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF and Word documents are allowed' }, { status: 400 })
    }

    // Generate application ID
    const applicationId = `APP${Date.now()}`

    // Convert file to buffer for MongoDB storage
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Save to MongoDB
    const db = await getDatabase()
    
    const studentDoc = {
      applicationId,
      agentEmail: session.user.email,
      studentName,
      email,
      phone,
      passportNumber,
      country: preferredCountry,
      course: courseInterest,
      status: 'Pending',
      file: fileBuffer,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      adminNotes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection('students').insertOne(studentDoc)

    // Append to Google Sheets (optional - only if configured)
    if (process.env.GOOGLE_SHEET_ID) {
      try {
        const { createSheetsClient } = await import('@/lib/google-sheets')
        const sheetsClient = createSheetsClient()
        await sheetsClient.appendStudent({
          applicationId,
          agentEmail: session.user.email,
          studentName,
          email,
          phone,
          country: preferredCountry,
          course: courseInterest,
          status: 'Pending',
          adminNotes: '',
          lastUpdated: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Google Sheets error:', error)
      }
    }

    // Send email notification (optional - only if configured)
    if (process.env.RESEND_API_KEY && process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            subject: `New Student Application - ${applicationId}`,
            template: 'student_uploaded',
            data: {
              applicationId,
              agentEmail: session.user.email,
              studentName,
              email,
              phone,
              country: preferredCountry,
              course: courseInterest,
              fileName: file.name,
            },
          }),
        })
      } catch (error) {
        console.error('Email notification error:', error)
      }
    }

    return NextResponse.json(
      {
        success: true,
        applicationId,
        message: 'Student uploaded successfully',
        data: {
          studentName,
          email,
          phone,
          courseInterest,
          preferredCountry,
          passportNumber,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload student' }, { status: 500 })
  }
}
