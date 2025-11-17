# Join2Campus Agent Portal

A comprehensive agent portal for managing student applications to European universities across 16 countries.

## Features

### Agent Portal
- 🎓 Browse 217+ partner universities across 16 European countries
- 📤 Upload student applications with document management
- 📊 Track application status in real-time
- 📈 View personal performance dashboard
- 🔔 Receive email notifications on status changes

### Admin Portal
- 👥 Manage 45+ education consultant agents
- 📋 Review and process student applications
- ✅ Update application status with admin notes
- 📊 View system-wide analytics and reports
- 🌍 Manage university partnerships across Europe

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes, NextAuth.js v4
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth with credential provider
- **Email**: Resend API
- **Sheets Integration**: Google Sheets API v4

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- MongoDB Atlas account
- (Optional) Google Cloud service account for Sheets integration
- (Optional) Resend API key for email notifications

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/join2campus-agent-portal.git
cd join2campus-agent-portal
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your:
- MongoDB connection string
- NextAuth secret (generate with: \`openssl rand -base64 32\`)
- Google Sheets credentials (optional)
- Resend API key (optional)

4. Set up the database:
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000/api/setup-db\` to initialize collections and demo users.

5. Login with demo credentials:
- **Agent**: agent@example.com / password123
- **Admin**: admin@example.com / password123

## Project Structure

\`\`\`
.
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth authentication
│   │   ├── students/       # Student upload endpoints
│   │   ├── notifications/  # Email notification endpoints
│   │   └── admin/          # Admin management endpoints
│   ├── dashboard/          # Agent portal pages
│   ├── admin/              # Admin portal pages
│   └── login/              # Authentication page
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── dashboard/          # Agent dashboard components
│   ├── admin/              # Admin dashboard components
│   └── upload/             # File upload components
├── lib/
│   ├── mongodb.ts          # MongoDB connection helper
│   ├── google-sheets.ts    # Google Sheets integration
│   └── notifications.ts    # Email notification service
└── public/                 # Static assets
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## Environment Variables

See \`.env.example\` for required environment variables.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure Node.js 18+ and set all environment variables before deployment.

## Network Coverage

**Countries**: India, Nepal, Sri Lanka, Ghana, Philippines  
**European Destinations**: France, Germany, Ireland, Spain, Netherlands, Italy, Poland, Portugal, Czech Republic, Austria, Belgium, Hungary, Denmark, Sweden, Cyprus, Malta

## License

Proprietary - Join2Campus © 2025

## Support

For issues and support, contact: support@join2campus.com
