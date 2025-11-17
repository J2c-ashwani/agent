import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[Auth] Missing credentials')
          return null
        }

        try {
          // Dynamic imports to avoid build-time errors
          const { getDatabase } = await import('@/lib/mongodb')
          const { compare } = await import('bcryptjs')
          
          const db = await getDatabase()
          const user = await db.collection('agents').findOne({ 
            email: credentials.email 
          })

          console.log('[Auth] User lookup:', user ? 'Found' : 'Not found', credentials.email)

          if (!user) {
            console.log('[Auth] User not found in database')
            return null
          }

          const isValid = await compare(credentials.password, user.password)
          console.log('[Auth] Password valid:', isValid)

          if (!isValid) {
            console.log('[Auth] Invalid password')
            return null
          }

          console.log('[Auth] Login successful:', user.email, user.role)

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('[Auth] Error during authentication:', error)
          return null
        }
      },
    }),
  ],
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session?.user) (session.user as any).role = token.role
      return session
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
