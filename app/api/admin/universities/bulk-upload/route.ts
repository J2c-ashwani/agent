import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read CSV content
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    // Parse CSV (simple parsing - assumes: name,country,programs,intakes,tuition,requirements)
    const headers = lines[0].split(',').map(h => h.trim())
    const universities = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length >= 6) {
        universities.push({
          name: values[0],
          country: values[1],
          programs: values[2].split(';').map(p => p.trim()),
          intakes: values[3].split(';').map(i => i.trim()),
          tuition: values[4],
          requirements: values[5],
          createdAt: new Date(),
        })
      }
    }

    if (universities.length === 0) {
      return NextResponse.json({ error: 'No valid data found in CSV' }, { status: 400 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    
    await db.collection('universities').insertMany(universities)

    return NextResponse.json({ 
      success: true, 
      message: `${universities.length} universities uploaded successfully`,
      count: universities.length
    })
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
