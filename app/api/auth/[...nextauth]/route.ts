import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const db = await getDatabase()
          const user = await db.collection('agents').findOne({ 
            email: credentials.email 
          })

          if (!user) return null

          const isValid = await compare(credentials.password, user.password)
          if (!isValid) return null

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
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
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
