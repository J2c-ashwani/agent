import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const dynamic = 'force-dynamic'

// Don't forget to install: npm install --legacy-peer-deps xlsx

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

    const arrayBuffer = await file.arrayBuffer()
    const ext = file.name.split(".").pop()?.toLowerCase()

    let rows: any[] = []
    if (ext === "csv") {
      // Parse CSV
      const decoder = new TextDecoder("utf-8")
      const text = decoder.decode(arrayBuffer)
      const lines = text.split("\n").filter(l => l.trim())
      if (lines.length < 2) {
        return NextResponse.json({ error: "CSV is empty" }, { status: 400 })
      }
      const headers = lines[0].split(",").map(h => h.trim())
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim())
        if (values.length < 6) continue
        rows.push({
          name: values[0],
          country: values[1],
          programs: values[2].split(/[,;]/).map(p => p.trim()),
          intakes: values[3].split(/[,;]/).map(i => i.trim()),
          tuition: values[4],
          requirements: values[5],
          createdAt: new Date(),
        })
      }
    } else if (ext === "xlsx" || ext === "xls") {
      // Parse Excel
      const { read, utils } = await import("xlsx")
      const workbook = read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const data: any[] = utils.sheet_to_json(sheet, { header: 1 })

      const headers = data[0]
      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        if (!row || row.length < 6) continue
        rows.push({
          name: row[0]?.toString().trim(),
          country: row[1]?.toString().trim(),
          programs: row[2]?.toString().split(/[,;]/).map((p: string) => p.trim()),
          intakes: row[3]?.toString().split(/[,;]/).map((m: string) => m.trim()),
          tuition: row[4]?.toString().trim(),
          requirements: row[5]?.toString().trim(),
          createdAt: new Date(),
        })
      }
    } else {
      return NextResponse.json({ error: "Unsupported file format. Only CSV, XLS, XLSX allowed." }, { status: 400 })
    }

    if (!rows.length) {
      return NextResponse.json({ error: "No data found in file." }, { status: 400 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    await db.collection('universities').insertMany(rows)

    return NextResponse.json({
      success: true,
      count: rows.length,
      message: `Successfully uploaded ${rows.length} universities`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
