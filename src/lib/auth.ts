import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Check Admin first
                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email }
                })

                if (admin) {
                    const isValid = await bcrypt.compare(credentials.password, admin.password)
                    if (isValid) {
                        return {
                            id: admin.id,
                            email: admin.email,
                            name: admin.name,
                            role: 'admin'
                        }
                    }
                }

                // Check User (Buyer)
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (user) {
                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if (isValid) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name ?? '',
                            role: 'user'
                        }
                    }
                }

                return null
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/account/login' // Unified login page if possible, or keep separate
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as { role: string }).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id: string }).id = token.id as string;
                (session.user as { role: string }).role = token.role as string;
            }
            return session
        }
    }
}
