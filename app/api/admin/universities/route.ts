import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    
    const universities = await db.collection('universities')
      .find({})
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ 
      success: true,
      universities: universities.map(u => ({
        id: u._id.toString(),
        name: u.name,
        country: u.country,
        programs: u.programs || [],
        intakes: u.intakes || [],
        tuition: u.tuition,
        requirements: u.requirements,
      }))
    })
  } catch (error: any) {
    console.error('Fetch universities error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
