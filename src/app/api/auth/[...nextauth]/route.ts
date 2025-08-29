// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                // IMPORTANT: Use environment variables for security
                const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
                const adminPassword = process.env.ADMIN_PASSWORD || "password123";

                if (credentials.email === adminEmail && credentials.password === adminPassword) {
                    // Return a user object for the session
                    // This object will be available in the JWT token
                    return { id: "1", name: 'admin', email: adminEmail };
                }

                // Return null if credentials do not match
                return null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        // Tell NextAuth.js to use your custom login page
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };