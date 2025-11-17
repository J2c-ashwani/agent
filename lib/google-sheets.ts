import { google } from 'googleapis'

interface GoogleSheetsConfig {
  clientEmail: string
  privateKey: string
  sheetId: string
}

interface StudentRow {
  applicationId: string
  agentEmail: string
  studentName: string
  email: string
  phone: string
  country: string
  course: string
  status: string
  adminNotes: string
  lastUpdated: string
}

export class GoogleSheetsClient {
  private config: GoogleSheetsConfig

  constructor(config: GoogleSheetsConfig) {
    this.config = config
  }

  private getAuthClient() {
    return new google.auth.JWT({
      email: this.config.clientEmail,
      key: this.config.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
  }

  async appendStudent(data: StudentRow): Promise<void> {
    try {
      const auth = this.getAuthClient()
      const sheets = google.sheets({ version: 'v4', auth })
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.config.sheetId,
        range: 'Sheet1!A:J',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            data.applicationId,
            data.agentEmail,
            data.studentName,
            data.email,
            data.phone,
            data.country,
            data.course,
            data.status,
            data.adminNotes,
            data.lastUpdated,
          ]],
        },
      })

      console.log('[GoogleSheets] Appended student:', data.studentName)
    } catch (error) {
      console.error('[GoogleSheets] Append error:', error)
      throw error
    }
  }

  async getSyncUpdates(): Promise<StudentRow[]> {
    try {
      const auth = this.getAuthClient()
      const sheets = google.sheets({ version: 'v4', auth })
      
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: this.config.sheetId,
        range: 'Sheet1!A:J',
      })

      const rows = result.data.values || []
      
      // Skip header row
      const dataRows = rows.slice(1)
      
      return dataRows.map((row) => ({
        applicationId: row[0] || '',
        agentEmail: row[1] || '',
        studentName: row[2] || '',
        email: row[3] || '',
        phone: row[4] || '',
        country: row[5] || '',
        course: row[6] || '',
        status: row[7] || 'pending',
        adminNotes: row[8] || '',
        lastUpdated: row[9] || new Date().toISOString(),
      }))
    } catch (error) {
      console.error('[GoogleSheets] Sync error:', error)
      return []
    }
  }

  async updateStudentStatus(applicationId: string, status: string, adminNotes: string): Promise<void> {
    try {
      const auth = this.getAuthClient()
      const sheets = google.sheets({ version: 'v4', auth })
      
      // Find the row with this applicationId
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: this.config.sheetId,
        range: 'Sheet1!A:J',
      })

      const rows = result.data.values || []
      const rowIndex = rows.findIndex((row) => row[0] === applicationId)
      
      if (rowIndex === -1) {
        throw new Error(`Application ${applicationId} not found`)
      }

      // Update status and notes (columns H and I)
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.config.sheetId,
        range: `Sheet1!H${rowIndex + 1}:J${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[status, adminNotes, new Date().toISOString()]],
        },
      })

      console.log(`[GoogleSheets] Updated ${applicationId} to status: ${status}`)
    } catch (error) {
      console.error('[GoogleSheets] Update error:', error)
      throw error
    }
  }
}

export function createSheetsClient(): GoogleSheetsClient {
  return new GoogleSheetsClient({
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || '',
    privateKey: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    sheetId: process.env.GOOGLE_SHEET_ID || '',
  })
}
